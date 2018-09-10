import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { User } from '../models';

import emailTemplate from '../utils/services/emailTemplate';

dotenv.config();

const secret = process.env.JWT_KEY;
const baseURL = process.env.BASE_URL;

/**
 *
 * @description controller class with methods for email verification and confirmation
 * @class EmailVerificationController
 */
class EmailVerificationController {
  /**
   * @description Email verification after sign up
   * @param  {object} user argument passed when calling method
   * @param  {function} id of the new user
   * @returns {object} The body of the resposne message
   * @memberof EmailVerificationController
   */
  static sendVerificationEmail(user) {
    try {
      const { id, email } = user;
      const emailToken = jwt.sign({ email, id }, secret, { expiresIn: '1h' });

      const url = `${baseURL}/api/users/confirmation/${emailToken}`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'noreply@authorshaven.com',
        subject: 'Authors\' Haven Email Verification',
        html: emailTemplate.verficationEmailTemplate(url),
      };
      return sgMail.send(msg);
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Confirms user's email after sign up
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   * @memberof EmailVerificationController
   */
  static confirmEmail(req, res) {
    const { token } = req.params;
    const { email } = jwt.verify(token, secret);
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User does not exist in the database'
          });
        }
        if (user.emailVerified) {
          return res.status(409).json({
            status: 'error',
            message: 'Email has already been confirmed',
          });
        }
        if (!token) {
          return res.status(400).json({
            status: 'success',
            message: 'Token is invalid'
          });
        }
        user.emailVerified = true;
        user.save();
        return res.status(200).json({
          status: 'success',
          message: 'Email confirmed successfully. You can now login',
        });
      })
      .catch(error => res.status(400).send(error));
  }

  /**
   * @description Resend verification email if requested by user
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   * @memberof EmailVerificationController
   */
  static resendVerificationEmail(req, res) {
    const { email } = req.body;
    email.trim();

    return User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User does not exist'
          });
        }
        if (user.emailVerified) {
          return res.status(409).json({
            status: 'error',
            message: 'Your account had already been verified'
          });
        }

        const emailToken = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
        const url = `${baseURL}/api/users/confirmation/${emailToken}`;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: 'noreply@authorshaven.com',
          subject: 'Authors Haven Email Verification',
          html: emailTemplate.verficationEmailTemplate(url),
        };
        return sgMail.send(msg)
          .then(() => {
            res.status(200).json({
              status: 'success',
              message: 'Verification email has been resent'
            });
          });
      });
  }
}

export default EmailVerificationController;
