import moment from 'moment';
import {
  Article,
  User,
  Tag,
  Comment,
  ReportsOnArticle,
  ArticleViewHistory,
  Subscription
} from '../models';
import articleValidation from '../utils/articles';
import paginateArticle from '../utils/articlesPaginate';
import Notification from './notifications';
import Search from './search';
import ReportInputValidation from '../utils/validateReportInput';

/**
 * Article controller function
 */
class ArticleController {
  /**
   * @static
   * @description returns slug from article title
   * @param {string} title
   * @returns {string} slug
  */
  static slugify(title) {
    return title.replace(/\s+/g, '-') + Math.floor((Math.random() * 1000000) + 1).toString();
  }

  /**
   * @static
   * @description static method to find or create tag.
   * @param {object} req
   * @param {object} res
   * @returns {string} slug
  */
  static createTags(req, res) {
    const { tag } = req.body;

    const { error, isValid } = articleValidation.validateTag(req.body);
    if (!isValid) {
      return res.status(400).json({
        error,
        status: 'error'
      });
    }

    Tag.findOrCreate({ where: { tag } })
      .then(newTag => res.status(200).json({
        newTag,
        status: 'success'
      }))
      .catch(errors => res.status(400).json({
        errors,
        status: 'error'
      }));
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @return {json} res
   * @description creates article.
   */
  static create(req, res) {
    // validation file :(to be moved to validations file)
    const { error, isValid } = articleValidation.validateArticle(req.body);
    if (!isValid) {
      return res.status(400).json({
        error,
        status: 'error'
      });
    }

    // get parameters from request
    const {
      title, description, body,
    } = req.body;

    const tags = req.body.tags || [];

    if (tags.length > 5) {
      return res.status(400).json({
        error: {
          message: 'Article tags must not exceed 5',
        },
        status: 'error'
      });
    }

    // set author id to current user id
    const authorId = req.userId;

    // generate slug
    const slug = ArticleController.slugify(title);

    User.findById(authorId, {
      attributes: ['username', 'email', 'bio', 'image']
    }).then((user) => {
      // create article
      Article.create({
        title, description, body, authorId, slug
      })
        .then(newArticle => newArticle.addTags(tags))
        .then(() => {
          Article.findOne({
            where: { slug },
            include: [{
              model: Tag,
              as: 'tags',
              attributes: ['tag'],
              through: {
                attributes: [],
              },
            }],
          })
            .then(createdArticle => res.status(200).json({
              newArticleAlert: {
                createdArticle,
                author: user,
              },
              status: 'success'
            }))
            .then(() => {
              Notification.notifyForArticle(req.userId, slug, title, user.username);
            });
        });
    });
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @return {json} res
   * @description returns all article.
  */
  static getAllArticles({ query }, res) {
    const limit = Number(query.limit) || 4;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    return Article.findAndCountAll({
      where: {
        displayStatus: true,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      }, {
        model: Tag,
        as: 'tags',
        attributes: ['tag'],
        through: {
          attributes: [],
        },
      }],
      attributes: ['id', 'slug', 'title', 'description', 'createdAt', 'updatedAt', 'authorId'],
      limit,
      offset
    })
      .then((article) => {
        const pagination = paginateArticle(article, currentPage, limit);
        res.status(200).json({
          pagination,
          articles: article.rows,
          status: 'success'
        });
      })
      .catch(error => res.status(500).json({
        error,
        status: 'error'
      }));
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description a query to get a specific article by its slug.
  */
  static getArticleQuery(req, res, next) {
    const { userId } = req;
    return Article.findOne({
      where: {
        slug: req.params.article_slug,
        displayStatus: true,
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      }, {
        model: Tag,
        as: 'tags',
        attributes: ['tag'],
        through: {
          attributes: [],
        },
      }, {
        model: Comment,
      }],
      attributes: ['id', 'slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: 'Article does not exist'
          });
        }
        // Save the view in the Article view table
        const articleId = article.id;
        res.locals = { userId, articleId };
        next();
        return res.status(200).json({
          article,
          status: 'success',
        });
      })
      .catch(error => res.status(400).json({
        error,
        status: 'error'
      }));
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description returns specific article that has the slug passed as a req param (article_slug).
  */
  static getArticle(req, res, next) {
    const { userId, userRole } = req;
    ArticleViewHistory.findAll({
      where: { userId }
    })
      .then((articlesFound) => {
        const numberOfArticlesRead = articlesFound.length;
        if (numberOfArticlesRead < 5) {
          return ArticleController.getArticleQuery(req, res, next);
        }
        if (numberOfArticlesRead >= 5 && userRole === 'user') {
          return Subscription.findOne({
            where: { userId },
            order: [
              ['paymentDate', 'DESC']
            ]
          })
            .then((user) => {
              if (user) {
                const expiration = moment(user.expiryDate);
                const currentDate = moment();
                if (currentDate <= expiration) {
                  return ArticleController.getArticleQuery(req, res, next);
                }
                return res.status(401).json({
                  status: 'error',
                  error: {
                    message: 'Your subscription is not active, Please renew to get more articles'
                  }
                });
              }
              return res.status(401).json({
                status: 'error',
                error: {
                  message: 'Please subscribe to get more articles'
                }
              });
            }).catch(next);
        }
      }).catch(next);
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @return {json} res
   * @description returns specific article with given slug.
  */
  static update(req, res) {
    return Article.findOne({
      where: {
        slug: req.params.article_slug,
        displayStatus: true,
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      }],
    })
      .then((article) => {
        // return 404 if article not found
        if (!article) {
          return res.status(404).json({
            error: { message: 'article not found' },
            status: 'error'
          });
        }

        // check if article belongs to current user
        if (parseInt(article.authorId, 10) !== parseInt(req.userId, 10)) {
          return res.status(403).json({
            error: { message: 'forbidden from editing another user\'s article' },
            status: 'error'
          });
        }

        return article.update({
          title: req.body.title || article.title,
          slug: ArticleController.slugify(req.body.title) || article.slug,
          description: req.body.description || article.description,
          body: req.body.body || article.body
        })
          .then((self) => {
            const updated = self;
            delete updated.id;
            delete updated.authorId;
            res.status(200).json({
              article: updated,
              status: 'success'
            });
          })
          .catch(error => res.status(400).json({
            error,
            status: 'error'
          }));
      })
      .catch(error => res.status(400).json({
        error,
        status: 'error'
      }));
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @return {json} res
   * @description deletes an article object with given slug in param.
  */
  static delete(req, res) {
    return Article.findOne({
      where: {
        slug: req.params.article_slug,
        displayStatus: true
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            error: { message: 'article not found' },
            status: 'error'
          });
        }

        // check if article belongs to current user
        if (parseInt(article.authorId, 10) !== parseInt(req.userId, 10)) {
          return res.status(403).json({
            error: { message: 'forbidden from deleting another user\'s article' },
            status: 'error'
          });
        }

        return article.destroy()
          .then(() => res.status(200).json({
            message: 'article successfully deleted',
            status: 'success'
          }))
          .catch(error => res.status(400).json({
            error,
            status: 'error'
          }));
      })
      .catch(error => res.status(400).json({
        error,
        status: 'error'
      }));
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} jsonResponse
  */
  static search(req, res, next) {
    // expects author to be author username
    const { author, tag, keywords } = req.query;

    // search by given query parameter
    if (author) {
      Search.byAuthor(author, res, next);
    } else if (tag) {
      Search.byTags(tag, res, next);
    } else if (keywords) {
      Search.byKeywords(keywords, res, next);
    } else {
      res.status(400).json({
        status: 'error',
        error: { message: 'no search parameter supplied' }
      });
    }
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description deletes an article object with given slug in param.
  */
  static reportOnArticle(req, res, next) {
    const slug = req.params.article_slug;
    const { userId, userName } = req;
    const { reasonForReport, reportBody } = req.body;

    const { error, isValid } = ReportInputValidation.validateArticleReportInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        error,
        status: 'error'
      });
    }

    Article.findOne({
      where: { slug }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Article does not exist',
            }
          });
        }
        return ReportsOnArticle.create({
          userId,
          username: userName,
          articleId: article.id,
          reasonForReport,
          reportBody,
        })
          .then(report => res.status(200).json({
            status: 'success',
            report,
            message: 'Thanks for the feedback. We will look into this.'
          }))
          .catch(next);
      }).catch(next);
  }
}


export default ArticleController;
