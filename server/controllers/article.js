
const db = require('../models');

const { Article, User } = db;

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
   * @param {reuest} req
   * @param {response} res
   * @return {response} res
   * @description creates article.
   */
  static create(req, res) {
    // get parameters from request
    const {
      title, description, body,
    } = req.body;

    // validation file :(to be moved to validations file)
    let missingFieldErrorMsg = '';
    if (!description) {
      missingFieldErrorMsg = 'article description missing';
    } else if (!title) {
      missingFieldErrorMsg = 'article title missing';
    } else if (!body) {
      missingFieldErrorMsg = 'article body missing';
    }
    if (missingFieldErrorMsg) {
      return res.status(400).json({
        status: 'fail',
        message: missingFieldErrorMsg,
      });
    }


    // currentUserId to be gotten from req.frofile
    const currentUserId = 1;

    const authorId = currentUserId;

    // generate slug
    const slug = ArticleController.slugify(title);

    User.findById(authorId, {
      attributes: ['username', 'email', 'bio', 'image']
    }).then((user) => {
      // create article
      Article.create({
        title, description, body, authorId, slug
      })
        .then(article => res.status(201).json({
          article: {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            author: user,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
          }
        }));
    });
  }

  /**
   * @static
   * @param {reuest} req
   * @param {response} res
   * @return {response} res
   * @description returns all article.
  */
  static getAll(req, res) {
    return Article.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    })
      .then((article) => {
        res.status(200).json({
          articles: article
        });
      })
      .catch(error => res.status(500).json(error));
  }

  /**
   * @static
   * @param {reuest} req
   * @param {response} res
   * @return {response} res
   * @description returns specific article that has the slug passes as req param (article_slug).
  */
  static getSpecific(req, res) {
    return Article.findOne({
      where: { slug: req.params.article_slug },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'bio', 'image']
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
   * @param {reuest} req
   * @param {response} res
   * @return {response} res
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
        if (!article) {
          return res.status(404).json({
            message: 'article not found'
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
   * @param {reuest} req
   * @param {response} res
   * @return {response} res
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
