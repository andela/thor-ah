import {
  Article, Comment, User, Reply, CommentLikesDislike
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
  static getCommentById(req, res, next) {
    const { commentId } = req.params;


    Comment.findOne({
      where: {
        id: commentId
      },
      include: [{
        model: User,
        as: 'commenter',
        include: [],
        attributes: {
          exclude: ['hash', 'emailVerified', 'email', 'role', 'createdAt', 'updatedAt']
        }
      },
      {
        model: CommentLikesDislike,
        as: 'reactions',
        attributes: ['userId', 'username', 'commentId', 'reaction']
      }]
    })
      .then(comment => res.status(200).json(comment))
      .catch(next);
  }

  /**
   * @description query method for users to like or dislike comments made on articles
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {string} reaction parameter for like or dislike
   * @param {string} processed parameter for liked or disliked
   * @param {string} reversed parameter for liked or disliked
   * @param {string} value
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof CommentsController
   */
  static commentReactionQuery(req, res, reaction, processed, reversed, value, next) {
    const id = req.params.commentId;
    const { userId, userName } = req;

    Comment.findOne({
      where: {
        id,
      },
    })
      .then((comment) => {
        if (!comment) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'comment does not exist'
            }
          });
        }
        CommentLikesDislike.findOne({
          where: {
            userId
          }
        })
          .then((commentLike) => {
            if (commentLike) {
              if (commentLike.reaction === `${value}`) {
                return CommentLikesDislike.destroy({
                  where: { userId }
                })
                  .then(() => res.status(200).json({
                    status: 'success',
                    message: `comment ${reaction} removed`
                  }));
              }
              if (commentLike.reaction === `${reversed}`) {
                return res.status(400).json({
                  status: 'error',
                  error: {
                    message: `You have already ${processed} this comment`,
                  }
                });
              }
            }
            return CommentLikesDislike.create({
              userId,
              commentId: id,
              username: userName,
              reaction: `${value}`,
            })
              .then(() => Comment.findOne({
                where: {
                  id,
                },
                include: [{
                  model: User,
                  as: 'commenter',
                  attributes: {
                    exclude: ['hash', 'emailVerified', 'email', 'role', 'bio', 'twitter', 'linkedin', 'userFollowId', 'createdAt', 'updatedAt']
                  }
                }, {
                  model: CommentLikesDislike,
                  as: 'reactions',
                  attributes: ['userId', 'username', 'commentId', 'reaction']
                }]
              })
                .then(newLike => res.status(200).json(newLike))
                .catch(next)).catch(next);
          }).catch(next);
      }).catch(next);
  }

  /**
   * @description like or dislike comments made on articles
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {next} next calls next
   * @memberof CommentsController
   */
  static likeOrDislikeComment(req, res) {
    if (req.params.reaction !== 'like' && req.params.reaction !== 'dislike') {
      return res.status(400).json({
        status: 'error',
        message: 'You can only like or unlike this comment'
      });
    }
    if (req.params.reaction === 'like') {
      return CommentsController.commentReactionQuery(req, res, 'like', 'disliked', '0', '1');
    }
    if (req.params.reaction === 'dislike') {
      return CommentsController.commentReactionQuery(req, res, 'dislike', 'liked', '1', '0');
    }
  }

  /**
   * @description get number of likes and dislikes in an article
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next object
   * @returns {next} res object
   * @memberof CommentsController
   */
  static getCommentslikesandDislikes(req, res, next) {
    const id = req.params.commentId;
    const commentReactions = { likes: 0, dislikes: 0 };

    Comment.findOne({
      where: {
        id,
      }
    })
      .then((comment) => {
        if (!comment) {
          return res.status(404).json({
            status: 'error',
            message: 'comment does not exist',
          });
        }
        CommentLikesDislike.findAll({
          where: {
            commentId: comment.id,
          },
        })
          .then((commentLikes) => {
            if (commentLikes === null) {
              res.status(200).json({
                status: 'success',
                commentReactions: {
                  likes: 0,
                  dislikes: 0,
                }
              });
            }
            commentLikes.forEach((commentReaction) => {
              if (commentReaction.reaction === '1') {
                commentReactions.likes += 1;
              } else if (commentReaction.reaction === '0') {
                commentReactions.dislikes += 1;
              }
            });
            res.status(200).json({
              status: 'success',
              commentReactions,
            });
          });
      }).catch(next);
  }
}

export default CommentsController;
