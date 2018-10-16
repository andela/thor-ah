import Notification from './notifications';
import {
  Article, Comment, User, Reply, CommentLikesDislike, CommentHistory
} from '../models';
import isEmpty from '../utils/is_empty';

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
   * @param {object} article article promise
   * @param {string} articleBody article body to update with
   * @param {string} highlighted highlighted text
   * @param {string} cssId
   * @param {object} commentObj
   * @param {object} res
   * @param {objec} next
   * @returns {boolean} true if diff btwn new and current article body is expected, false otherwise
   * @memberof CommentsController
   */
  static processHighlighted(article, articleBody, highlighted, cssId, commentObj, res, next) {
    // returns true if article should be saved, else false
    const injectionCheck = () => {
      const closingTagLength = 7; // '</span>'.length
      const openingTag = `<span id=“${cssId}” class=“highlighted”>`;
      const stripped = articleBody.replace(openingTag, ''); //
      return (stripped.length - article.body.length) === closingTagLength;
    };

    const error = {};

    if (isEmpty(highlighted)) {
      error.highlighted = 'highlighted text missing';
    }

    if (isEmpty(cssId)) {
      error.cssId = 'cssId missing';
    }

    if (isEmpty(articleBody)) {
      error.articleBody = 'injected article body missing';
    } else if (!injectionCheck()) {
      error.articleBody = 'injected article body: characters mismatch';
    }

    if (Object.keys(error).length !== 0) {
      return res.status(400).json({
        status: 'error',
        error
      });
    }
    article.update({ body: articleBody }).then(() => {
      commentObj.highlighted = highlighted;
      commentObj.cssId = cssId;
      CommentsController.saveComment(res, next, commentObj);
    }).catch(next);
  }


  /**
   * createComment
   *
   * @static
   * @param {object} res
   * @param {object} next
   * @param {object} comment
   * @returns {object} jsonResponse
   * @memberof CommentsController
   */
  static saveComment(res, next, comment) {
    Comment.create(comment)
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
      .then(newComment => res.status(201).json({
        status: 'success',
        comment: newComment,
      }))
      .catch(next);
  }

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
    const {
      comment,
      articleBody,
      highlighted,
      cssId
    } = req.body;

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

        const commentObj = {
          articleId: article.id,
          commenterId: userId,
          body: comment,
        };

        if (highlighted || cssId || articleBody) {
          CommentsController.processHighlighted(
            article, articleBody, highlighted, cssId,
            commentObj, res, next
          );
        } else {
          CommentsController.saveComment(res, next, commentObj);
        }
      })
      .catch(next);
  }

  /**
   * update existing comment
   *
   * @static
   * @param {obj} req
   * @param {obj} res
   * @param {obj} next
   * @returns {next/res} returns a response if successful otherwise calls
   * the next middleware with an error
   * @memberof CommentsController
   */
  static updateComment(req, res, next) {
    const { commentId } = req.params;
    const { userId } = req;
    Comment.findById(commentId)
      .then((comment) => {
        if (!comment) {
          const error = new Error('comment does not exist');
          error.status = 404;
          return next(error);
        }
        // check if user in current session is same user that created the comment
        // prevent user from updating another users' comment
        if (userId !== comment.commenterId) {
          const error = new Error('you are not allowed to update another user\'s comment');
          error.status = 401;
          return next(error);
        }

        // update comment
        return comment.update({
          body: req.body.comment,
        })
          .then(updatedComment => res.status(200).json({
            status: 'success',
            comment: updatedComment,
          }))
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
    return Comment.findOne({
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
                  exclude: ['hash', 'emailVerified', 'role', 'createdAt', 'updatedAt']
                }
              }, {
                model: Comment,
                as: 'comment',
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                }
              }]
            }))
          .then(newCommentReply => res.status(201).json({
            status: 'success',
            commentReply: newCommentReply,
          }))
          .then(() => {
            comment.getArticle()
              .then((article) => {
                comment
                  .getReplies({
                    include: [{
                      model: User,
                      as: 'commenter',
                      attributes: {
                        exclude: ['hash', 'emailVerified', 'role', 'createdAt', 'updatedAt']
                      },
                    }, {
                      model: Comment,
                      as: 'comment',
                      attributes: {
                        exclude: ['createdAt', 'updatedAt']
                      }
                    }]
                  })
                  .then((replies) => {
                    const { slug, title } = article;
                    const repliers = replies.map(el => el.commenter);
                    Notification.notifyForCommentReplies(title, slug, repliers, userId);
                  });
              })
              .catch(next);
          });
      })
      .catch(next);
  }

  /**
   * @description get comment by the id
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof CommentsController
   */
  static getCommentById(req, res, next) {
    const { commentId } = req.params;
    const commentReactions = { likes: 0, dislikes: 0 };

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
        as: 'likes',
        where: {
          reaction: '1',
        },
        required: false,
        attributes: ['userId', 'username', 'commentId', 'reaction']
      },
      {
        model: CommentLikesDislike,
        as: 'dislikes',
        where: {
          reaction: '0',
        },
        required: false,
        attributes: ['userId', 'username', 'commentId', 'reaction']
      }, {
        model: Reply,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }]
    })
      .then((comment) => {
        if (!comment) {
          return res.status(404).json({
            status: 'error',
            message: 'comment does not exist',
          });
        }
        commentReactions.likes = comment.likes.length;
        commentReactions.dislikes = comment.dislikes.length;
        const { username, id } = comment.commenter;
        return res.status(200).json({
          status: 'success',
          commentId: comment.id,
          body: comment.body,
          articleId: comment.articleId,
          commenter: {
            id, username
          },
          likesCount: commentReactions.likes,
          dislikesCount: commentReactions.dislikes,
          Replies: comment.Replies
        });
      })
      .catch(next);
  }

  /**
   * @description query method for users to like or dislike comments made on articles
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {string} reaction parameter for like or dislike
   * @param {string} processed parameter for liked or disliked
   * @param {string} reactedOn parameter for liked or disliked
   * @param {string} reversed parameter for liked or disliked
   * @param {string} value
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof CommentsController
   */
  static commentReactionQuery(req, res, reaction, processed, reactedOn, reversed, value, next) {
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
        return CommentLikesDislike.findOne({
          where: {
            userId
          }
        })
          .then((commentLike) => {
            // check if comment has a reaction from the user
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
              // check if an opposing reaction already exists
              // then just destroy the opposite reaction and create the new one
              if (commentLike.reaction === `${reversed}`) {
                return Promise.all([
                  CommentLikesDislike.destroy({
                    where: { userId }
                  }),
                  CommentLikesDislike.create({
                    userId,
                    commentId: id,
                    username: userName,
                    reaction: `${value}`,
                  })
                ])
                  .then(() => res.status(200).json({
                    status: 'success',
                    message: `comment ${reactedOn}`
                  }));
              }
            }
            // otherwise create reaction if it doesn't exist
            return CommentLikesDislike.create({
              userId,
              commentId: id,
              username: userName,
              reaction: `${value}`,
            })
              .then(() => res.status(200).json({
                status: 'success',
                message: `comment ${reactedOn}`
              }));
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
      return CommentsController.commentReactionQuery(req, res, 'like', 'disliked', 'liked', '0', '1');
    }
    if (req.params.reaction === 'dislike') {
      return CommentsController.commentReactionQuery(req, res, 'dislike', 'liked', 'disliked', '1', '0');
    }
  }


  /**
   * @description check like status of a currently logged in user on a comment
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next object
   * @returns {next} res object
   * @memberof CommentsController
   */
  static checkReactionStatus(req, res, next) {
    const id = req.params.commentId;
    const { userId } = req;

    Comment.findOne({
      where: { id }
    })
      .then((comment) => {
        if (!comment) {
          if (!comment) {
            return res.status(404).json({
              status: 'error',
              message: 'comment does not exist',
            });
          }
        }
        CommentLikesDislike.findOne({
          where: { userId }
        })
          .then((likedislike) => {
            if (!likedislike) {
              return res.status(200).json({
                status: 'success',
                message: 'you have not reacted to this comment',
              });
            }
            if (likedislike.reaction === '1') {
              return res.status(200).json({
                reactionStatus: true,
              });
            }
            return res.status(200).json({
              reactionStatus: false,
            });
          });
      }).catch(next);
  }

  /**
  * Get all comments and replies belonging to an article
  *
  * @static
  * @param {obj} req
  * @param {obj} res
  * @param {obj} next
  * @returns {next/res} returns a response if successful otherwise calls
  * the next middleware with an error
  * @memberof CommentsController
  */
  static getArticleComments(req, res, next) {
    const slug = req.params.article_slug;
    Article
      .findOne({
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
        return article.getComments({
          include: [
            {
              model: User,
              as: 'commenter',
              attributes: {
                exclude: ['hash', 'emailVerified', 'email', 'role', 'createdAt', 'updatedAt']
              },
            },
            {
              model: CommentLikesDislike,
              as: 'likes',
              where: {
                reaction: '1',
              },
              required: false,
            },
            {
              model: CommentLikesDislike,
              as: 'dislikes',
              where: {
                reaction: '0',
              },
              required: false,
            },
            {
              model: Reply,
              include: [
                {
                  model: User,
                  as: 'commenter',
                  attributes: {
                    exclude: ['hash', 'emailVerified', 'email', 'role', 'createdAt', 'updatedAt']
                  }
                }
              ]
            }
          ],
        })
          .then((comments) => {
            const commentsResponse = comments.map((comment) => {
              const {
                id, body, isEdited, createdAt, updatedAt, commenter, Replies, likes, dislikes,
                highlighted, cssId
              } = comment;
              return {
                id,
                body,
                highlighted,
                cssId,
                isEdited,
                createdAt,
                updatedAt,
                commenter,
                replies: Replies,
                likesCount: likes.length,
                dislikesCount: dislikes.length,
              };
            });
            res.status(200).json({
              status: 'success',
              comments: commentsResponse,
            });
          })
          .catch(next);
      })
      .catch(next);
  }

  /**
   * Get edit history of a comment
   *
   * @static
  * @param {obj} req
  * @param {obj} res
  * @param {obj} next
  * @returns {next/res} returns a response if successful otherwise calls
  * the next middleware with an error
   * @memberof CommentsController
   */
  static getCommentEdits(req, res, next) {
    const { commentId } = req.params;
    Comment
      .findById(commentId)
      .then((comment) => {
        if (!comment) {
          const error = new Error('comment does not exist');
          error.status = 404;
          return next(error);
        }
        return CommentHistory
          .findAll({
            where: {
              commentId,
            }
          })
          .then(history => res.status(200).json({
            status: 'success',
            history,
          }))
          .catch(next);
      })
      .catch(next);
  }
}

export default CommentsController;
