const sendgrid = require('@sendgrid/mail');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./../models');

const { User } = db;
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
env.config();

/**
 * User class
 * @class Users
 */
export default class Users {
  /**
  * Recover user password
  * @param {obj} req
  * @param {obj} res
  * @param {obj} next
  * @returns {json} send reset link via email to user
  * @memberof Users
  */
  static recoverPassword(req, res, next) {
    const { email } = req.body.user;
    const { reset } = req.body.links;

    User
      .count({ where: { email } })
      .then((count) => {
        if (count === 0) {
          return res.status(404).json({
            errors: {
              message: 'User with this email does exist.',
              error: {
                status: 404,
              }
            }
          });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET_TOKEN, { expiresIn: '2h' });
        const resetLink = `${reset}/${token}`;

        const msg = `
          <p>Hello,</p>
          <p>There was recently a request to change the password on your account.</p>
          <p>If you requested this password change, click below to set a new password within 2 hours:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you don’t want to change your password, just ignore this message.</p>
          <p>
            Thank you.<br>
            <b>The Authors' Haven Team</b>
          </p>
        `;
        const mail = {
          to: email,
          from: 'noreply@authorshaven.com',
          subject: 'Authors\' Haven Password Reset',
          html: msg,
        };
        sendgrid.send(mail)
          .then(() => {
            res.status(200).json({
              success: {
                message: 'We have sent you a verification link. Please check your email to continue.',
                success: {
                  status: 200,
                }
              }
            });
          })
          .catch(next);
      })
      .catch(next);
  }


  /**
  * Recover user password
  * @param {obj} req
  * @param {obj} res
  * @param {obj} next
  * @returns {json} reset user password
  * @memberof Users
  */
  static resetPassword(req, res, next) {
    const { token } = req.params;
    const { password } = req.body.user;
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, user) => {
      if (error) {
        return res.status(400).json({
          errors: {
            message: 'Reset link is expired or invalid. Please try again.',
            error: {
              status: 400,
            }
          }
        });
      }
      if (!password) {
        return res.status(400).json({
          errors: {
            message: 'Please provide your password.',
            error: {
              status: 400,
            }
          }
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          errors: {
            message: 'Password is too short. Password should contain at least 6 characters.',
            error: {
              status: 400,
            }
          }
        });
      }

      const hash = bcrypt.hashSync(password, 10);

      User
        .update({ hash }, { where: { email: user.email } })
        .then((users) => {
          if (users) {
            res.status(200).json({
              success: {
                message: 'Password changed successfully.',
                success: {
                  status: 200,
                }
              }
            });
          }
        }).catch(next);
    });
  }
}
