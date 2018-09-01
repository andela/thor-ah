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
}

export default UsersController;
