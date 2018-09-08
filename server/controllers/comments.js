import {
  Article, Comment, User, Reply
} from '../models';

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
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof CommentsController
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

  /**
   * create Comment reply
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof CommentsController
   */
  static createCommentReply(req, res, next) {
    const { commentId } = req.params;
    const { userId } = req;
    const { reply } = req.body;
    Comment.findOne({
      where: {
        id: commentId,
      }
    })
      .then((comment) => {
        if (!comment) {
          const error = new Error('comment does not exist');
          error.status = 404;
          next(error);
        }
        Reply.create({
          commentId,
          commenterId: userId,
          reply,
        })
          .then(newCommentReply => Reply
            .findById(newCommentReply.id, {
              include: [{
                model: User,
                as: 'commenter',
                attributes: {
                  exclude: ['hash', 'emailVerified', 'email', 'role', 'createdAt', 'updatedAt']
                }
              }, {
                model: Comment,
                as: 'comment',
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                }
              }]
            }))
          .then((newCommentReply) => {
            res.status(201).json({
              status: 'success',
              commentReply: newCommentReply,
            });
          })
          .catch(next);
      })
      .catch(next);
  }
}

export default CommentsController;
