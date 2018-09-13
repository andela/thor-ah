import { Article, ArticleView, Category } from '../models';

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
      attributes: ['userId', 'articleId'],
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['title', 'body', 'authorId']
        }
      ]
    })
      .then((user) => {
        if (!user) {
          return res.status(200).json({
            status: 'success',
            message: 'No articles read yet'
          });
        }
        const articleIds = user.map(detail => detail.articleId);
        const mostReadCategory = user.map((detail) => {
          return Category.findAll({
            where: { id: detail.articleId },
            attributes: ['name']
          })
            .then((categories) => {
              return res.status(200).json({
                status: 'success',
                user,
                articlesRead: articleIds.length,
                mostReadCategory: categories
              });
            })
            .catch(error => error);
        });
        // return res.status(200).json({
        //   status: 'success',
        //   user,
        //   articlesRead: articleIds.length,
        // })
        // return user.count()
          // .then(result => res.status(200).json({ status: 'success', result }))
          // .catch(error => res.status(400).json({ status: 'error', error }));
        return mostReadCategory;
      })
      .catch(error => res.status(400).json({ status: 'error', error }));
  }

  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof ReadingStatsController
   */
  static getMostReadCategory(req, res) {

  }

}

export default ReadingStatsController;
