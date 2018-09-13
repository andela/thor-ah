import { Article, LikesDislikes } from '../models';

/**
 * @class likesDislikesController
 */
class likesDislikesController {
  /**
   * @desc Like an article
   * @param {obj} req request body
   * @param {obj} res response body
   * @param {obj} next next action
   * @return {obj} returns an object
   */
  static likeOrDislike(req, res, next) {
    const { articleId } = req.params;
    const { userId } = req;
    const { reaction } = req.body;

    if (!articleId || articleId.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid article ID provided.',
        },
      });
    }

    if (!reaction || reaction.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No reaction provided.',
        },
      });
    }

    if (reaction !== 'like') {
      if (reaction !== 'dislike') {
        return res.status(400).json({
          status: 'error',
          error: {
            message: "Reaction must either be 'like' or 'dislike'",
          },
        });
      }
    }
    const status = reaction === 'like' ? '1' : '0';

    Article.findOne({
      where: {
        id: articleId,
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Article was not found.',
            },
          });
        }

        LikesDislikes.findOne({
          where: {
            userId,
          }
        })
          .then((likeOrDislike) => {
            if (!likeOrDislike) {
              LikesDislikes.create({
                articleId,
                userId,
                reaction: status,
              })
                .then(() => res.status(200).json({
                  status: 'success',
                  message: `Article ${reaction}d successfully.`,
                }))
                .catch(err => next(err));
            } else if (likeOrDislike.reaction === status) {
              LikesDislikes.destroy({
                where: {
                  articleId,
                  userId,
                }
              })
                .then(() => res.status(200).json({
                  status: 'success',
                  message: 'Reaction removed.',
                })).catch(err => next(err));
            } else {
              LikesDislikes.update({
                reaction: status,
              }, {
                where: {
                  userId,
                  articleId,
                }
              })
                .then(() => res.status(200).json({
                  status: 'success',
                  message: `Article ${reaction}d successfully.`,
                }))
                .catch(err => next(err));
            }
          }).catch(err => next(err));
      }).catch(err => next(err));
  }

  /**
   * @desc Get all reaction for an article
   * @param {obj} req request body
   * @param {obj} res response body
   * @param {obj} next next action
   * @return {obj} returns an object
   */
  static getLikesDislikes(req, res, next) {
    const { articleId } = req.params;
    if (!articleId || articleId.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid article ID provided.',
        },
      });
    }

    return Article.findOne({
      where: {
        id: articleId,
      }
    })
      .then((article) => {
        if (!article) {
          res.status(404).json({
            status: 'error',
            error: {
              message: 'Article was not found.',
            },
          });
        }
        Promise.all([
          LikesDislikes.findAll({
            where: {
              articleId: article.id,
              reaction: '1',
            },
          }),
          LikesDislikes.findAll({
            where: {
              articleId: article.id,
              reaction: '0',
            },
          })
        ])
          .then((results) => {
            res.status(200).json({
              status: 'success',
              reactions: {
                likes: results[0].length,
                dislikes: results[1].length,
              },
            });
          }).catch(err => next(err));
      }).catch(err => next(err));
  }

  /**
   * @desc check if a user liked or disliked an article
   * @param {obj} req request body
   * @param {obj} res response body
   * @param {obj} next next action
   * @return {obj} returns an object
   */
  static getReactionStatus(req, res, next) {
    const { articleId } = req.params;
    const { userId } = req;

    if (!articleId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid article ID provided.',
        },
      });
    }
    Article.findOne({
      where: {
        id: articleId,
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Article was not found.',
            },
          });
        }

        LikesDislikes.findOne({
          where: {
            articleId,
            userId,
          }
        })
          .then((likeDislike) => {
            if (!likeDislike) {
              return res.status(200).json({
                status: 'success',
                message: 'You have not reacted to this article.',
              });
            }
            return res.status(200).json({
              status: 'success',
              reaction: likeDislike.reaction === '1' ? 'like' : 'dislike',
            });
          }).catch(err => next(err));
      }).catch(err => next(err));
  }
}

export default likesDislikesController;
