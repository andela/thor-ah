import { User } from '../models';

/**
 *
 *
 * @class HandleRoles
 */
class HandleRoles {
  /**
   * assign a user an admin role
   *
   * @static
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next middlewere
   * @returns {res/next} returns response if successful or calls next with error
   * @memberof HandleRoles
   */
  static assignAdminRole(req, res, next) {
    const { userId } = req.params;

    User.findById(userId, {
      attributes: {
        exclude: ['hash', 'bio', 'twitter', 'linkedin', 'userFollowId']
      }
    })
      .then((user) => {
        if (!user) {
          const error = new Error('user does not exist');
          error.status = 404;
          return next(error);
        }
        user.update({
          role: 'admin',
        })
          .then(updatedUser => res.status(200).json({
            status: 'success',
            user: updatedUser,
          }))
          .catch(next);
      })
      .catch(next);
  }

  /**
   * revoke a user an admin role
   *
   * @static
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next middlewere
   * @returns {res/next} returns response if successful or calls next with error
   * @memberof HandleRoles
   */
  static revokeAdminRole(req, res, next) {
    const { userId } = req.params;

    User.findById(userId, {
      attributes: {
        exclude: ['hash', 'bio', 'twitter', 'linkedin', 'userFollowId']
      }
    })
      .then((user) => {
        if (!user) {
          const error = new Error('user does not exist');
          error.status = 404;
          return next(error);
        }
        user.update({
          role: 'user',
        })
          .then(updatedUser => res.status(200).json({
            status: 'success',
            user: updatedUser,
          }))
          .catch(next);
      })
      .catch(next);
  }
}

export default HandleRoles;
