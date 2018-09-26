import sendgrid from '@sendgrid/mail';
import { User } from '../models';
import TokenHelper from '../utils/TokenHelper';
import EmailVerification from './emailVerificationController';

const key = process.env.SENDGRID_API_KEY;

sendgrid.setApiKey(key);

/**
 * @class SocialAuthController
 */
class SocialAuthController {
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user
   * @param {function} done
   * @returns {object} createOrFindUser
   * @memberof SocialAuthController
   */
  static modelQuery(user, done) {
    User.findOrCreate({
      where: {
        email: user.email
      },
      defaults: user,
    }).spread((foundOrCreated, created) => {
      const {
        id, email, username, firstName, role, lastName, image
      } = foundOrCreated.dataValues;
      done(null, {
        email, id, username, firstName, role, lastName, image, created,
      });
    });
  }

  /**
    * @description response function
    * @static
    * @param {object} req
    * @param {object} res
    * @returns {json} json
    * @memberof SocialAuthController
  */
  static response(req, res) {
    const user = {
      id: req.user.id,
      role: req.user.role,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      email: req.user.email,
      image: req.user.image
    };
    user.token = TokenHelper.generateToken(user);
    if (req.user.created) {
      EmailVerification.sendVerificationEmail(user);
      return res.status(201).send({
        message: 'Signup was successful, Please check your email to verify your account',
        user,
        status: 'success'
      });
    }
    return res.status(200).send({
      message: 'You are logged in',
      user,
      status: 'success'
    });
  }

  /**
   * @description - callback function for strategy
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   *
   * @returns {json} json
   *
   * @memberof SocialAuthController
   */
  static passportCallback(accessToken, refreshToken, profile, done) {
    const userProfile = {
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      username: profile.displayName,
      email: profile.emails[0].value,
      image: profile.photos[0].value,
      hash: 'any password'
    };
    SocialAuthController.modelQuery(userProfile, done);
  }
}
export default SocialAuthController;
