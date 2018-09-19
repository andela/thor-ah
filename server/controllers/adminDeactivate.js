import { User, Article } from '../models';

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
  static deleteAuthor(req, res, next) {
    const { authorId } = req.params;
    return User
      .findById(authorId, {
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
            { authorId: 5 },
            { where: { authorId } }
          )
          .then(() => {
            User
              .destroy({
                where: { id: authorId }
              });
            res.status(200).json({
              message: 'user successfully deleted',
              status: 'success'
            });
          })
          .catch(error => res.status(400).json({
            error,
            status: 'error'
          }));
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
  static deactivateUser(req, res) {
    // find user and update active column to false
    const { userId } = req.params;
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
        User.update({ active: false }, { where: { id: userId } });
        return res.status(200).json({
          message: 'User has been deactivated successfully',
          status: 'success'
        });
      });
  }
}

export default AdminDeactivateController;
