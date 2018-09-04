import bcrypt from 'bcrypt';
import sendgrid from '@sendgrid/mail';
import env from 'dotenv';
import jwt from 'jsonwebtoken';

import db from '../models';
import isValidNumber from '../utils/is_valid_number';
import UserValidation from '../validation/users';
import trimInput from '../utils/trim_input';
import TokenHelper from '../utils/TokenHelper';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
env.config();

const { User } = db;

/**
 *
 * @description controller class with methods for user endpoints
 *  @class UserController
 */
class UsersController {
  /**
   * @description Signup method for new users
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the response message
   */
  static userSignup(req, res, next) {
    const { errors, isValid } = UserValidation.validateSignUpInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      hash: req.body.password,
    };

    User.findOne({
      where: { username: newUser.username },
    }).then((user) => {
      if (!user) {
        return User.findOne({
          where: { email: newUser.email },
        }).then((userEmail) => {
          if (!userEmail) {
            return User.create(newUser)
              .then((createdUser) => {
                const { dataValues } = createdUser;
                // remove hash from user data values
                const { hash, id, ...rest } = dataValues;
                const token = TokenHelper.generateToken(createdUser);
                // return remaining user data and generated token
                return res.status(201).json({
                  user: {
                    ...rest,
                    token
                  }
                });
              })
              .catch(next);
          }
          return res.status(400).json({
            errors: {
              email: 'This email has already been registered',
            }
          });
        })
          .catch(next);
      }
      return res.status(400).json({
        errors: {
          username: 'This username has already been registered',
        }
      });
    }).catch(next);
  }

  /**
   * @description Method to login registered users
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   */
  static userLogin(req, res, next) {
    const { errors, isValid } = UserValidation.validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            errors: {
              email: 'User not found'
            }
          });
        }
        bcrypt.compare(password, user.hash).then((isMatch) => {
          if (isMatch) {
            const { dataValues } = user;
            // remove hash from user data values
            const { hash, id, ...rest } = dataValues;
            const token = TokenHelper.generateToken(user);
            // return remaining user data and generated token
            return res.status(200).json({
              message: 'Login successful',
              user: {
                ...rest,
                token
              }
            });
          }
          return res.status(400).json({
            errors: {
              password: 'Incorrect Password'
            }
          });
        });
      })
      .catch(next);
  }

  /**
   * @description Static method to get all users' profiles
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   */
  static getProfiles(req, res, next) {
    User.findAll(
      {
        attributes: {
          exclude: ['hash']
        }
      }
    )
      .then(users => res.status(200).json({
        profiles: users,
      }))
      .catch(next);
  }

  /**
   * @description Static method to get user's profile by the username
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   */
  static getProfileByUsername(req, res, next) {
    const { username } = req.params;
    User.findOne({
      where: { username },
      attributes: {
        exclude: ['hash']
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            errors: {
              message: 'User not found',
            }
          });
        }
        return res.status(200).json({
          profile: user,
        });
      })
      .catch(next);
  }

  /**
   * @description Static method to update user's profile
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   */
  static updateUserProfile(req, res, next) {
    const { userId } = req.params;
    const {
      firstName, lastName, username, bio, twitter, linkedin, facebook, image
    } = req.body;

    const { errors, isValid } = UserValidation.validateProfileInput(req.body);

    isValidNumber(req, res);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            errors: {
              message: 'User not found',
            }
          });
        }
        User.findOne({ where: { username } })
          .then((userData) => {
            if (userData) {
              return res.status(409).json({
                errors: {
                  username: 'Username already exists',
                }
              });
            }
            return user.update({
              firstName: trimInput(firstName) || user.firstName,
              lastName: trimInput(lastName) || user.lastName,
              username: trimInput(username) || user.username,
              bio: trimInput(bio) || user.bio,
              twitter: twitter || user.twitter,
              linkedin: linkedin || user.linkedin,
              facebook: facebook || user.facebook,
              image: image || user.image,
            }).then((updatedUser) => {
              const { dataValues } = updatedUser;
              return res.status(200).json({ dataValues });
            }).catch(next);
          }).catch(next);
      }).catch(next);
  }

  /**
  * @description Send recovery mail to user's email
  * @param {obj} req response body
  * @param {obj} res request body
  * @param {obj} next next method to be called
  * @returns {json} reset user password
  * @memberof Users
  */
  static resetPassword(req, res, next) {
    const { reset } = req.body.tokens;
    const { password } = req.body.user;
    if (!reset || reset.trim().length < 1) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide a reset token.',
      });
    }
    if (!password || password.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a new password.',
      });
    }
    jwt.verify(reset, process.env.JWT_SECRET_TOKEN, (error, user) => {
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Reset link is expired. Please restart the recovery process.',
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          status: 'error',
          message: 'Password should be at least 6 characters.',
        });
      }

      const hash = bcrypt.hashSync(password, 10);

      User
        .update({ hash }, { where: { email: user.email } })
        .then((users) => {
          if (users) {
            res.status(200).json({
              status: 'success',
              message: 'Password changed successfully.',
            });
          }
        }).catch(next);
    });
  }

  /**
  * @description Reset user's password
  * @param {obj} req response body
  * @param {obj} res request body
  * @param {obj} next next method to be called
  * @returns {json} send reset link via email to user
  * @memberof Users
  */
  static recoverPassword(req, res, next) {
    const { email } = req.body.user;
    const { reset } = req.body.links;

    if (!email || email.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email.',
      });
    }

    if (!reset || reset.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid reset url.',
      });
    }

    User
      .findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'The email you provided is not registered.',
          });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET_TOKEN, { expiresIn: '2h' });
        const resetLink = `${reset}/${token}`;

        const msg = `
          <div style="font-size: 17px">
            <p>Hello,</p>
            <p>There was a recent request to change the password on your account.</p>
            <p>If you requested this password change, click the reset link below to set a new password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you don’t want to change your password, just ignore this message.</p>
            <p>Kindly note that reset link expires in 2 hours.</p>
            <p>
              Thank you.<br>
              <b>The Thor Authors' Haven Team</b>
            </p>
          </div>
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
              status: 'success',
              message: 'Please follow the instructions in the email that has been sent to your address.',
            });
          })
          .catch(() => {
            res.status(500).json({
              status: 'danger',
              message: 'Error occurred while trying to send mail. Please try again later.'
            });
          });
      })
      .catch(next);
  }
}

export default UsersController;
