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
        message: 'Please provide a valid reaction .',
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

    const status = reaction === 'like' ? 'liked' : 'disliked';

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

        if (article.authorId === req.userId) {
          return res.status(400).json({
            status: 'error',
            message: 'You cannot like or dislike your article.',
          });
        }

        LikesDislikes.findOne({
          where: {
            userId,
          }
        })
          .then((likeOrDislike) => {
            if (likeOrDislike === null || likeOrDislike === undefined) {
              LikesDislikes.create({
                articleId,
                userId,
                status,
              })
                .then(() => res.status(200).json({
                  status: 'success',
                  message: `Article ${status} successfully.`,
                }))
                .catch(err => next(err));
            } else if (likeOrDislike.status === status) {
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
                status,
              }, {
                where: {
                  userId,
                  articleId,
                }
              })
                .then(() => res.status(200).json({
                  status: 'success',
                  message: `Article ${status} successfully.`,
                }))
                .catch(err => next(err));
            }
          }).catch(err => next(err));
      }).catch(err => next(err));
  }
}

export default likesDislikesController;
