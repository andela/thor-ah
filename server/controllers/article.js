
import db from '../models';
import articleValidation from '../utils/articles';
import paginateArticle from '../utils/articlesPaginate';

const { Article, User, Tag } = db;

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

    const { errors, isValid } = articleValidation.validateTag(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    Tag.findOrCreate({ where: { tag } })
      .then(newTag => res.status(200).json(newTag))
      .catch(error => res.status(400).json(error));
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
    const { errors, isValid } = articleValidation.validateArticle(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // get parameters from request
    const {
      title, description, body,
    } = req.body;

    const tags = req.body.tags || [];

    if (tags.length > 5) {
      return res.status(400).json({
        errors: {
          message: 'Article tags must not exceed 5',
        }
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
            }));
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
          articles: article.rows
        });
      })
      .catch(error => res.status(500).json(error));
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
      }],
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    })
      .then(article => res.status(200).json({
        article
      }))
      .catch(error => res.status(400).json(error));
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
            errors: { message: 'article not found' }
          });
        }

        // check if article belongs to current user
        if (parseInt(article.authorId, 10) !== parseInt(req.userId, 10)) {
          return res.status(403).json({
            errors: { message: 'forbidden from editing another user\'s article' }
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
            res.status(200).json({ article: updated });
          })
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
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
            message: 'article not found',
          });
        }

        // check if article belongs to current user
        if (parseInt(article.authorId, 10) !== parseInt(req.userId, 10)) {
          return res.status(403).json({
            errors: { message: 'forbidden from deleting another user\'s article' }
          });
        }

        return article.destroy()
          .then(() => res.status(200).json({
            message: 'article successfully deleted',
          }))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  }
}

export default ArticleController;
