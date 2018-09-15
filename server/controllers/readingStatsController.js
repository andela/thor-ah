import {
  Article, ArticleView, Category, LikesDislikes, ArticleCategory
} from '../models';
import modeValue from '../utils/modeValue';

/**
 *
 * @description controller class with methods for categorizing articles
 * @class RedingStatsController
 */
class ReadingStatsController {
  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof ReadingStatsController
   */
  static getAllReadingStats(req, res) {
    const { userId } = req;
    ArticleView.findAll({
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
                    const names = categoryNames.map(category => category.name);
                    mostReadCategory = modeValue(names);
                    return res.status(200).json({
                      status: 'success',
                      articlesRead: articles.length === 0 ? 'You have not read any article' : articles,
                      numberOfArticlesRead: articleCount.length,
                      articleReactions: reaction.length === 0 ? 'You have not liked/disliked any article' : reaction,
                      mostReadCategory
                    });
                  })
                  .catch(error => res.status(400).send(error));
              })
              .catch(error => error);
          })
          .catch(error => error);
      })
      .catch(error => res.status(400).json({ status: 'error', error }));
  }
}

export default ReadingStatsController;
