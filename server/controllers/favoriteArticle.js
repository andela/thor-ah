
import { favoriteArticle, Article, User } from '../models';
import paginateArticle from '../utils/articlesPaginate';


/**
 * @class FavoriteArticleController
 */
class FavoriteArticleController {
  /**
   * @description - adds an article to the user's favorite list of articles
   * @memberof FavoriteArticleController
   * @param {object} req
   * @param {object} res
   * @returns {object} string
   */
  static create(req, res) {
    favoriteArticle.findOne({
      where: {
        articleId: req.params.articleId,
        userId: req.userId
      }
    })
      .then((foundFavoriteArticle) => {
        if (foundFavoriteArticle) {
          return res.status(409).json({
            status: 'error',
            error: { message: 'you have favorited this article already' }
          });
        }
        return favoriteArticle.create({
          articleId: req.params.articleId,
          userId: req.userId
        });
      })
      .then(favoritedArticle => res.status(201).json({
        status: 'success',
        message: 'This article is added to your favorite list',
        favoritedArticle
      }))
      .catch(error => res.status(500).json({
        status: 'error',
        error: { message: error.message ? error.message : 'An error occured during this operation' }
      }));
  }

  /**
   * @description - removes an article from the user's favorite list of articles
   * @memberof FavoriteArticleController
   * @param {object} req
   * @param {object} res
   * @returns {object} string
   */
  static remove(req, res) {
    const { articleId } = req.params;
    return favoriteArticle
      .find({
        where: {
          articleId
        }
      })
      .then((favoritedArticle) => {
        if (!favoritedArticle) {
          return res.status(404).json({
            error: { message: 'Article not found in your favorite list' },
            status: 'error'
          });
        }
        return favoritedArticle
          .destroy()
          .then(() => res.status(200).json({
            message: 'Article successfully removed from your favorite list',
            status: 'success'
          }))
          .catch(error => res.status(500).json({ error, status: 'error' }));
      })
      .catch(error => res.status(500).json({ error, status: 'error' }));
  }

  /**
   * @description - lists all the user's favorite article
   * @memberof FavoriteArticleController
   * @param {object} req
   * @param {object} res
   * @returns {object} string
   */
  static list(req, res) {
    const limit = Number(req.query.limit) || 4;
    const currentPage = Number(req.query.page) || 1;
    const offset = (currentPage - 1) * limit;

    return favoriteArticle.findAndCountAll({
      limit,
      offset,
      where: { userId: req.userId },
      include: [
        {
          model: Article,
          attributes: ['title', 'description', 'body', 'slug', 'createdAt'],
          include: [{
            model: User,
            as: 'author',
            attributes: ['firstName', 'lastName', 'username'],
          }]
        },
      ],
      attributes: { exclude: ['userId', 'articleId', 'createdAt', 'updatedAt'] },
    })
      .then((articles) => {
        const pagination = paginateArticle(articles, currentPage, limit);
        return res.status(200).json({
          message: 'Your favorite articles',
          pagination,
          articles: articles.rows,
          status: 'success'
        });
      })
      .catch(error => res.status(500).json({
        error,
        status: 'error'
      }));
  }
}

export default FavoriteArticleController;
