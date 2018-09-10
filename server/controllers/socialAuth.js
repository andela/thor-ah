import { User } from '../models';
import TokenHelper from '../utils/TokenHelper';


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
        id, email, username, firstName, lastName, image
      } = foundOrCreated.dataValues;
      done(null, {
        email, id, username, firstName, lastName, image, created,
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
      email: req.user.email,
      username: req.user.username,
      lastName: req.user.lastName,
      firstName: req.user.firstName,
      image: req.user.image
    };
    user.token = TokenHelper.generateToken(user);
    if (req.user.created) {
      return res.status(201).send({
        message: 'you have successfully signed up',
        user,
        status: 'success'
      });
    }
    return res.status(200).send({
      message: 'you are logged in',
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
