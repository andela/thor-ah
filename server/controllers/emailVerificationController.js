import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import db from '../models';
import dotenv from 'dotenv';
import emailTemplate from '../utils/services/emailTemplate';
dotenv.config();

const { User } = db;

const secret = process.env.EMAIL_SECRET;

class EmailVerificationController {
  /**
   * send verification mail
   * @param {obj} req
   * @param {obj} res
   * @returns send a verification email to user after signup
   * @memberof EmailVerificationController
   */
  static sendVerificationEmail(req, res) {
    const id = req.params.id;
    User.findById(id)
      .then((email) => {
        try {
          const emailToken = jwt.sign({email, id}, 'secret', { expiresIn: '1h' });

          const url = `http://localhost:3000/api/confirmation/${emailToken}`;

          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: email,
            from: 'noreply@authorshaven.com',
            subject: 'Authors Haven Email Verification',
            html: emailTemplate.verficationEmailTemplate(url),
          };
          sgMail.send(msg);
          return res.status(200).json({
            status: 'success',
            message: 'Verification email has been sent successfuully'
          })
        } catch (error) {
          console.log(error)
        }
      })
      .catch(error => console.log(error))
  }

  /**
   * Confirm user's email
   * @param {obj} req
   * @param {obj} res
   * @returns confirm email address
   * @memberof EmailVerificationController
   */
  static confirmEmail(req, res) {
    const token = req.params.token;
    const { id } = jwt.verify(token, 'secret')
    User.findById(id)
      .then(emailVerified => {
        if (emailVerified === true) {
          return res.status(409).json({
            status: 'failed',
            message: 'Email has already been confirmed',
          })
        }
        return User
          .update({ emailVerified: true }, {where: {id}})
          .then(emailVerified => (
            res.status(200).json({
              status: 'success',
              message: 'Email confirmed successfully. You can now login',
            })
          ))
        }) 
        .catch(error => console.log(error))
      }
 }

export default EmailVerificationController;