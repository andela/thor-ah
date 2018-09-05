
import db from '../models';
import articleValidation from '../utils/articles';

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
   * @return {json} res
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
   * @param {reuest} req
   * @param {response} res
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
