import { Article, Comment, User } from '../models';

/**
 *
 *
 * @class Comments
 */
class CommentsController {
  /**
   * createComment
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {null} null
   * @memberof Comments
   */
  static createComment(req, res, next) {
    const slug = req.params.article_slug;
    const { userId } = req;
    const { comment } = req.body;
    Article.findOne({
      where: {
        slug,
      }
    })
      .then((article) => {
        if (!article) {
          const error = new Error('article does not exist');
          error.status = 404;
          next(error);
        }
        // create comment
        Comment.create({
          articleId: article.id,
          commenterId: userId,
          body: comment,
        })
          .then(newComment => Comment
            .findById(newComment.id, {
              include: [{
                model: User,
                as: 'commenter',
                attributes: {
                  exclude: ['hash', 'emailVerified', 'email', 'role', 'createdAt', 'updatedAt']
                }
              }, {
                model: Article,
                as: 'article',
                attributes: {
                  exclude: ['authorId', 'createdAt', 'updatedAt']
                }
              }],
            }))
          .then((newComment) => {
            res.status(201).json({
              status: 'success',
              comment: newComment,
            });
          })
          .catch(next);
      })
      .catch(next);
  }
}

export default CommentsController;
