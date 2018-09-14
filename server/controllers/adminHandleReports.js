import { Article, User, ReportsOnArticle } from '../models';

/**
 *
 *
 * @class Comments
 */
class HandleReports {
  /**
   * @description get all reports made by users on all articles
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static getAllReports(req, res, next) {
    ReportsOnArticle.findAll({
      include: [{
        model: Article,
        as: 'article',
        attributes: {
          exclude: ['authorId', 'likeDislikeId', 'timeToRead', 'createdAt', 'updatedAt']
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['username', 'email', 'bio', 'image']
        }]
      }]
    })
      .then(reports => res.status(200).json({
        status: 'success',
        reports
      }))
      .catch(next);
  }

  /**
   * @description get a single report made by a user on an article
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static getSingleReport(req, res, next) {
    const id = req.params.reportId;
    ReportsOnArticle.findOne({
      where: { id },
      include: [{
        model: Article,
        as: 'article',
        attributes: {
          exclude: ['authorId', 'likeDislikeId', 'timeToRead', 'createdAt', 'updatedAt']
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['username', 'email', 'bio', 'image']
        }]
      }]
    })
      .then(report => res.status(200).json({
        status: 'success',
        report
      }))
      .catch(next);
  }

  /**
   * @description get a single report made by a user on an article
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static getReportsForSingleArticle(req, res, next) {
    const slug = req.params.article_slug;

    Article.findOne({
      where: { slug },
      include: [{
        model: ReportsOnArticle,
        as: 'reports',
        attributes: {
          exclude: ['userId', 'createdAt', 'updatedAt']
        },
      }, {
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      }]
    })
      .then(report => res.status(200).json({
        status: 'success',
        report
      }))
      .catch(next);
  }

  /**
   * @description block an article that violates terms
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static delistArticle(req, res, next) {
    const slug = req.params.article_slug;

    Article.findOne({
      where: {
        slug,
        displayStatus: true
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Article does not exist'
            }
          });
        }
        return article.update({
          displayStatus: false
        })
          .then(() => res.status(200).json({
            status: 'success',
            message: 'Article has been successfully delisted'
          })).catch(next);
      }).catch(next);
  }

  /**
   * @description get list of blocked articles
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static getDelistedArticles(req, res, next) {
    Article.findAll({
      where: {
        displayStatus: false
      }
    })
      .then(blockedArticles => res.status(200).json({
        status: 'success',
        blockedArticles
      })).catch(next);
  }

  /**
   * @description get a single blocked article
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static getADelistedArticle(req, res, next) {
    const slug = req.params.article_slug;
    Article.findOne({
      where: {
        slug,
        displayStatus: false
      }
    })
      .then(blockedArticle => res.status(200).json({
        status: 'success',
        blockedArticle
      })).catch(next);
  }

  /**
   * @description unblock an article
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof HandleReports
   */
  static relistArticle(req, res, next) {
    const slug = req.params.article_slug;

    Article.findOne({
      where: {
        slug,
        displayStatus: false
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Article does not exist'
            }
          });
        }
        return article.update({
          displayStatus: true
        })
          .then(() => res.status(200).json({
            status: 'success',
            message: 'Article has been successfully re-listed'
          })).catch(next);
      }).catch(next);
  }
}

export default HandleReports;
