import bcrypt from 'bcrypt';

import db from '../models';
import isValidNumber from '../utils/is_valid_number';
import UserValidation from '../validation/users';
import trimInput from '../utils/trim_input';

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
   * @returns {object} The body of the resposne message
   */
  static userSignup(req, res, next) {
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
              .then(userDetails => res.status(201).json({ userDetails }))
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
            return res.status(200).json({
              message: 'Login successful',
              user,
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
}

export default UsersController;
