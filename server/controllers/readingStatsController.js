import {
  Article,
  ArticleViewHistory,
  Category,
  LikesDislikes,
  ArticleCategory,
} from '../models';
import mode from '../utils/modeValue';

/**
 *
 * @description controller class with methods for getting user's reading stats
 * @class RedingStatsController
 */
class ReadingStatsController {
  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof ReadingStatsController
   */
  static getAllReadingStats(req, res, next) {
    const { userId } = req;
    ArticleViewHistory.findAll({
      where: { userId },
      attributes: ['articleId'],
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['title', 'body', 'description', 'authorId']
        }
      ]
    })
      .then((articles) => {
        const articleCount = articles.map(article => article.articleId);
        return LikesDislikes.findAll({
          where: { userId },
          attributes: ['articleId', 'reaction'],
          include: [
            {
              model: Article,
              as: 'article',
              attributes: ['title', 'body', 'description']
            }
          ]
        })
          .then((reaction) => {
            ArticleCategory.findAll({
              where: { articleId: articleCount }
            })
              .then((result) => {
                const categoryIds = result.map(article => article.categoryId);
                return Category.findAll({
                  where: { id: categoryIds },
                  attributes: ['name']
                })
                  .then((categoryNames) => {
                    let mostReadCategory;
                    if (categoryNames.length === 0) {
                      mostReadCategory = 'Articles have not been added to any category';
                    }
                    const allReactions = { liked: 0, disliked: 0, };
                    reaction.forEach((reactions) => {
                      if (reactions.reaction === '1') {
                        allReactions.liked += 1;
                      } else {
                        allReactions.disliked += 1;
                      }
                    });
                    const names = categoryNames.map(category => category.name);
                    mostReadCategory = mode(names);
                    return res.status(200).json({
                      status: 'success',
                      articlesRead: articles,
                      numberOfArticlesRead: articleCount.length,
                      articleReactions: allReactions,
                      mostReadCategory: mostReadCategory || 'None',
                    });
                  })
                  .catch(error => next(error));
              })
              .catch(error => next(error));
          })
          .catch(error => next(error));
      })
      .catch(error => next(error));
  }

  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @param  {string} articleId body of the user's request
   * @memberof ReadingStatsController
   */
  static postArticleViewHistory(req, res, next) {
    const { userId, articleId } = res.locals;
    ArticleViewHistory.findOne({
      where: { userId, articleId },
    })
      .then((userView) => {
        if (!userView) {
          ArticleViewHistory.create({ articleId, userId })
            .then(() => res.status(201).send())
            .catch(next);
        }
      })
      .catch(next);
  }
}

export default ReadingStatsController;
