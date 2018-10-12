import { Op } from 'sequelize';

import bcrypt from 'bcrypt';
import sendgrid from '@sendgrid/mail';
import env from 'dotenv';
import jwt from 'jsonwebtoken';

import EmailVerificationController from './emailVerificationController';
import isValidNumber from '../utils/is_valid_number';
import UserValidation from '../utils/validation';
import trimInput from '../utils/trim_input';
import TokenHelper from '../utils/TokenHelper';
import { User } from '../models';
import { isAdmin } from '../utils/verifyRoles';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
env.config();

/**
 *
 * @description controller class with methods for user endpoints
 * @class UserController
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
    const { error, isValid } = UserValidation.validateSignUpInput(req.body);
    if (!isValid) {
      return res.status(400).json({ status: 'error', error });
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
                EmailVerificationController.sendVerificationEmail(createdUser);
                // return remaining user data and generated token
                return res.status(201).json({
                  status: 'success',
                  user: {
                    ...rest,
                    token
                  },
                  message: 'Signup was successful. Please check your email to verify your account'
                });
              })
              .catch(next);
          }
          return res.status(400).json({
            status: 'error',
            error: {
              email: 'This email has already been registered',
            }
          });
        })
          .catch(next);
      }
      return res.status(400).json({
        status: 'error',
        error: {
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
   * @returns {object} The body of the response message
   */
  static userLogin(req, res, next) {
    const { error, isValid } = UserValidation.validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json({ error });
    }
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Incorrect email or password'
            }
          });
        }
        const { active } = user;
        if (!active) {
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'User has been deactivated'
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
              status: 'success',
              message: 'Login successful',
              user: {
                ...rest,
                token
              }
            });
          }
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'Incorrect email or password'
            }
          });
        });
      })
      .catch(next);
  }

  /**
   * @description Static method to get user's profile by the username
   * @param  {object} req body of the user's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the response message
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
            status: 'error',
            error: {
              message: 'User not found',
            }
          });
        }
        return res.status(200).json({
          status: 'success',
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
   * @returns {object} The body of the response message
   */
  static updateUserProfile(req, res, next) {
    const { userId } = req.params;
    const { userRole } = req;
    const {
      firstName, lastName, username, bio, twitter, linkedin, facebook, image
    } = req.body;

    const { error, isValid } = UserValidation.validateProfileInput(req.body);

    // assign role field if user in session is an admin
    const { role } = isAdmin(userRole) ? req.body : '';

    if (role === 'admin') {
      const err = new Error('only Super Admin can update role to admin');
      err.status = 401;
      return next(err);
    }

    isValidNumber(req, res);

    /*
    * prevent user from updating another users ' profile
    * check if user in current session is same with user being updated
    * An admin can update a users ' profile as well, so check if user
    * accessing this route is an admin
    */
    if (!isAdmin(userRole) && (Number(userId) !== Number(req.userId))) {
      const err = new Error('you are not allowed to update another user\'s profile');
      err.status = 401;
      return next(err);
    }

    if (!isValid) {
      return res.status(400).json({
        error,
        status: 'error'
      });
    }

    User.findById(userId)
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'User not found',
            }
          });
        }
        User.findOne({ where: { username } })
          .then((userData) => {
            if (userData) {
              return res.status(409).json({
                status: 'error',
                error: {
                  username: 'Username already exists',
                }
              });
            }
            return foundUser.update({
              firstName: trimInput(firstName) || foundUser.firstName,
              lastName: trimInput(lastName) || foundUser.lastName,
              username: trimInput(username) || foundUser.username,
              bio: trimInput(bio) || foundUser.bio,
              role: role || foundUser.role,
              twitter: twitter || foundUser.twitter,
              linkedin: linkedin || foundUser.linkedin,
              facebook: facebook || foundUser.facebook,
              image: image || foundUser.image,
            }).then((updatedUser) => {
              const { dataValues } = updatedUser;
              const { hash, id, ...rest } = dataValues;
              return res.status(200).json({
                status: 'success',
                user: {
                  ...rest
                }
              });
            }).catch(next);
          }).catch(next);
      }).catch(next);
  }

  /**
   * @description Static method for admin to get a list of all users
   * @param  {object} req body of the Admin's request
   * @param  {object} res  body of the response message
   * @param  {function} next next function to be called
   * @returns {object} The body of the resposne message
   */
  static adminGetUsers(req, res, next) {
    const { role } = req.query;
    if (!role) {
      User.findAll({
        where: {
          role: {
            [Op.or]: ['user', 'author', 'admin']
          }
        },
        attributes: {
          exclude: ['hash']
        }
      })
        .then(users => res.status(200).json({
          message: 'All registered users returned',
          status: 'success',
          profiles: users,
        })).catch(next);
    } else {
      User.findAll({
        where: {
          role
        },
        attributes: {
          exclude: ['hash']
        }
      })
        .then(users => res.status(200).json({
          message: `All registered ${role} returned`,
          status: 'success',
          profiles: users,
        })).catch(next);
    }
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
    jwt.verify(reset, process.env.JWT_KEY, (error, user) => {
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
    const { email } = req.body;

    if (!email || email.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email.'
      });
    }
    User
      .findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'The email you provided is not registered.'
          });
        }

        const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '2h' });
        const resetLink = `https://thor-ah.com/password/reset/${token}`;

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
              message: 'Please follow the instructions in the email that has been sent to your address.'
            });
          })
          .catch(() => {
            res.status(500).json({
              status: 'error',
              message: 'Error occurred while trying to send mail. Please try again later.'
            });
          });
      })
      .catch(next);
  }
}

export default UsersController;
