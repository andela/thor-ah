import { User, Article } from '../models';
import isValidNumber from '../utils/is_valid_number';
import { isAdmin } from '../utils/verifyRoles';

/**
 * @class adminDeactivate
 * @description class to deactivate delete a user from author haven
 */
class AdminDeactivateController {
  /**
   * @description Deletes an author and update all articles to new author role
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof AdminDeactivateController
   */
  static deleteUser(req, res, next) {
    const { userId } = req.params;
    const { userRole } = req;

    isValidNumber(req, res);

    if (!isAdmin(userRole) && (Number(userId) !== Number(req.userId))) {
      const err = new Error('you are not allowed to delete a user');
      err.status = 404;
      return next(err);
    }
    return User
      .findById(userId, {
        attributes: ['username', 'email', 'bio'],
        include: [{
          model: Article,
          as: 'authored',
          attributes: {
            exclude: ['timeToRead', 'createdAt', 'updatedAt']
          }
        }]
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: 'User does not exist' },
            status: 'error'
          });
        }
        Article
          .update(
            { userId: 5 },
            { where: { authorId: userId } }
          )
          .then(() => {
            User
              .destroy({
                where: { id: userId }
              });
            res.status(200).json({
              message: 'user successfully deleted',
              status: 'success'
            });
          })
          .catch(next);
      })
      .catch(next);
  }

  /**
   * @description Deactivate a user account
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof AdminDeactivateController
   */
  static deactivateUser(req, res, next) {
    // find user and update active column to false
    const { userId } = req.params;
    isValidNumber(req, res);
    return User
      .findById(userId, {
        where: { id: userId },
        attributes: ['username', 'email', 'active'],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: 'User does not exist' },
            status: 'error'
          });
        }
        User.update({ active: false }, { where: { id: userId } })
          .then(() => res.status(200).json({
            message: 'User has been deactivated successfully',
            status: 'success'
          }))
          .catch(next);
      })
      .catch(next);
  }

  /**
   * @description Activate a user account
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof AdminDeactivateController
   */
  static activateUser(req, res, next) {
    const { userId } = req.params;
    isValidNumber(req, res);
    User.findById(userId, {
      where: { id: userId },
      attributes: ['username', 'email', 'active'],
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: 'User does not exist' },
            status: 'error'
          });
        }
        User.update({ active: true }, { where: { id: userId } })
          .then(() => res.status(200).json({
            message: 'User has been reactivated successfully',
            status: 'success'
          }))
          .catch(next);
      })
      .catch(next);
  }
}

export default AdminDeactivateController;
