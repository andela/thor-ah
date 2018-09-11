import db from '../models';
import articleValidation from '../utils/articles';
import paginateArticle from '../utils/articlesPaginate';
import articleNotification from '../utils/articleNotify';
import Search from './search';

const {
  Article, User, Tag, Comment
} = db;

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
              User
                .findById(req.userId, {
                  include: [{
                    model: User,
                    as: 'following',
                    attributes: { exclude: ['emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
                  },
                  {
                    model: User,
                    as: 'followers',
                    attributes: { exclude: ['emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
                  }],
                }).then((users) => {
                  const author = users.firstName;
                  const emails = users.followers.map(el => el.email);
                  if (emails.length > 0) {
                    articleNotification.sendNotificationEmail(emails, author, slug);
                  }
                });
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
  static getAll({ query }, res) {
    const limit = Number(query.limit) || 4;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    return Article.findAndCountAll({
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
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt', 'authorId'],
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
   * @return {json} res
   * @description returns specific article that has the slug passes as req param (article_slug).
  */
  static getSpecific(req, res) {
    return Article.findOne({
      where: { slug: req.params.article_slug },
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
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    })
      .then(article => res.status(200).json({
        article,
        status: 'success'
      }))
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
   * @description returns specific article with given slug.
  */
  static update(req, res) {
    return Article.findOne({
      where: { slug: req.params.article_slug },
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
    return Article.findOne({ where: { slug: req.params.article_slug } })
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
        errors: { message: 'no search parameter supplied' }
      });
    }
  }
}


export default ArticleController;
