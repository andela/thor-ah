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

    User.findById(authorId, {
      attributes: ['username', 'email', 'bio'],
      include: [{
        model: Article,
        as: 'authored',
        attributes: {
          exclude: ['timeToRead', 'createdAt', 'updatedAt']
        }
      }]
    })
      .then(() => {
        Article.update(
          { authorId: 7 },
          { where: { authorId } }
        );
        User.destroy({
          where: { id: authorId }
        })
          .then(() => res.status(200).json({
            message: 'user successfully deleted',
            status: 'success'
          }))
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
  static deactivateUser(req, res, next) {
    // find user and set active column to false


  }
}

export default AdminDeactivateController;
