import db from '../models';

const { Article, LikesDislikes } = db;

/**
 * @class likeDislike
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
    const { articleSlug } = req.params;
    const { userId } = req;
    const { reaction } = req.body;

    if (!articleSlug || articleSlug.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid article slug.',
      });
    }

    if (!reaction || reaction.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'No reaction provided.',
      });
    }

    if ((reaction === 'like') !== true) {
      if ((reaction === 'dislike') !== true) {
        return res.status(400).json({
          status: 'error',
          message: "Reaction must either be 'like' or 'dislike'",
        });
      }
    }

    const status = reaction === 'like' ? '1' : '0';

    Article.findOne({
      where: {
        slug: articleSlug,
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            message: 'Article was not found.',
          });
        }
        const articleId = article.id;

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
    const { articleSlug } = req.params;
    const reactions = { likes: 0, dislikes: 0 };
    if (!articleSlug || articleSlug.trim().length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid article slug.',
      });
    }

    return Article.findOne({
      where: {
        slug: articleSlug,
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            message: 'Article was not found.',
          });
        }
        LikesDislikes.findAll({
          where: {
            articleId: article.id,
          },
        })
          .then((likesDislikes) => {
            if (likesDislikes === null) {
              res.status(200).json({
                status: 'success',
                reaction: {
                  likes: 0,
                  dislikes: 0,
                }
              });
            }
            likesDislikes.forEach((likeAndDislike) => {
              if (likeAndDislike.reaction === '1') {
                reactions.likes += 1;
              } else if (likeAndDislike.reaction === '0') {
                reactions.dislikes += 1;
              }
            });
            res.status(200).json({
              status: 'success',
              reactions,
            });
          });
      }).catch(err => next(err));
  }
}

export default likesDislikesController;
