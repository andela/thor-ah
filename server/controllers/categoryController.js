import {
  Category, Article, ArticleCategory
} from '../models';
import TokenHelper from '../utils/TokenHelper';

/**
 *
 * @description controller class with methods for categorizing articles
 * @class CategoryController
 */
class CategoryController {
  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static getAllCategories(req, res) {
    Category.all()
      .then(categories => (
        res.status(200).json({
          status: 'success',
          categories,
        })
      ))
      .catch(error => (
        res.status(400).json({
          status: 'error',
          error
        })
      ));
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the Admin's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static createCategory(req, res) {
    const newCategory = req.body.name.trim();
    if (newCategory === '') {
      return res.status(400).json({
        status: 'error',
        error: 'Name field cannot be empty'
      });
    }
    return Category.all()
      .then((allCategories) => {
        if (allCategories.length === 10) {
          return res.status(400).json({
            status: 'error',
            error: 'You cannot have more that 10 article categories'
          });
        }
        return Category.findOne({
          where: { name: newCategory }
        })
          .then((category) => {
            if (category) {
              return res.status(409).json({
                status: 'error',
                error: 'Article category already exists'
              });
            }
            return Category.create({
              name: newCategory,
            })
              .then(category => (
                res.status(201).json({
                  status: 'success',
                  category
                })
              ));
          })
          .catch(error => (
            res.status(400).json({
              status: 'error',
              error
            })
          ));
      });
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the Admin's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static updateCategory(req, res) {
    const { categoryName } = req.params;
    const updatedCategory = req.body.name;
    if (updatedCategory.trim() === '') {
      return res.status(400).json({
        status: 'error',
        error: 'Name value cannot be empty'
      });
    }
    return Category.findOne({
      where: { name: categoryName }
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'Cannot update a category that does not exist'
          });
        }
        return category.update({
          name: req.body.name || category.name
        })
          .then(() => (
            res.status(202).json({
              status: 'status',
              category,
            })
          ))
          .catch(error => (
            res.status(400).json({
              status: 'error',
              error
            })
          ));
      })
      .catch(error => (
        res.status(400).json({
          status: 'error',
          error
        })
      ));
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the Admin's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static deleteCategory(req, res) {
    const { categoryName } = req.params;
    Category.findOne({
      where: { name: categoryName }
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'You cannot delete a ategory does not exist'
          });
        }
        return category.destroy()
          .then(() => (
            res.status(204).json({
              status: 'success',
              error: 'Category deleted successfully'
            })
          ))
          .catch(error => res.status(400).json({ status: 'error', error }));
      })
      .catch(error => (
        res.status(400).json({
          status: 'error',
          error,
        })
      ));
  }

  /**
   * @description Adds an article to a  category
   * @param  {object} req body of the Author's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static addArticleToACategory(req, res, next) {
    const articleTitle = req.body.articleTitle;
    const categoryName = req.params.categoryName;
    // Check if category exists
    Category.findOne({
      where: { name: categoryName }
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'Category does not exist'
          });
        }
        // If category exists, check if article exists
        Article.findOne(({
          where: { title: articleTitle }
        }))
          .then((article) => {
            if (!article) {
              return res.status(404).json({
                status: 'error',
                error: 'Article does not exist'
              });
            }
            const categoryId = category.id;
            const articleId = article.id;
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1];
            const decoded = TokenHelper.decodeToken(token);
            const userId = decoded.id;
            if (article.authorId !== userId) {
              return res.status(403).json({
                status: 'error',
                error: 'You cannot modify another author\'s article'
              });
            }
            return ArticleCategory.find({
              where: { categoryId, articleId }
            })
              .then((articlePresent) => {
                if (articlePresent) {
                  return res.status(409).json({
                    status: 'error',
                    error: 'Article has already been added to this Category',
                  });
                }
                return ArticleCategory.create({
                  articleId, categoryId
                })
                  .then(created => (
                    res.status(202).json({
                      status: 'success',
                      created
                    })
                  ));
              })
              .catch(next);
          })
          .catch(error => res.status(400).json({ status: 'error', error }));
      })
      .catch(error => res.status(400).json({
        status: 'error',
        error
      }));
  }

  /**
   * @description Adds an article to a  category
   * @param  {object} req body of the Author's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static getAllArticlesForACategory(req, res, next) {
    const { categoryName } = req.params.categoryName;
    Category.findOne({
      where: { name: categoryName },
      include: [{
        model: Article,
        as: 'category',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }],
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'Category does not exist'
          });
        }
        return res.status(200).json({
          status: 'success',
          category
        });
      })
      .catch(next);
  }

  /**
   * @description Adds an article to a  category
   * @param  {object} req body of the Author's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static removeArticleFromACategory(req, res) {
    const articleTitle = req.body.articleTitle;
    const categoryName = req.params.categoryName;

    // Check if category exists
    Category.findOne({
      where: { name: categoryName }
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'Category does not exist'
          });
        }
        // If category exists, check if article exists
        Article.findOne(({
          where: { title: articleTitle }
        }))
          .then((article) => {
            if (!article) {
              return res.status(404).json({
                status: 'error',
                error: 'Article does not exist'
              });
            }
            const categoryId = category.id;
            const articleId = article.id;
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1];
            const decoded = TokenHelper.decodeToken(token);
            const userId = decoded.id;
            if (article.authorId !== userId) {
              return res.status(403).json({
                status: 'error',
                error: 'You cannot remove another author\'s article from this category',
              });
            }
            return ArticleCategory.findOne({
              where: { articleId, categoryId }
            })
              .then((articleJoin) => {
                if (!articleJoin) {
                  return res.status(404).json({
                    status: 'error',
                    error: 'You cannot remove an article that does not exists in this category'
                  });
                }
                return articleJoin.destroy()
                  .then(() => res.status(202).json({
                    status: 'success',
                    message: `Your article has been removed from ${categoryName}`
                  }))
                  .catch(error => (
                    res.status(400).json({
                      status: 'error',
                      error
                    })
                  ));
              })
              .catch(error => res.status(400).json({ status: 'error', error }));
          })
          .catch(error => res.status(400).json({ status: 'error', error }));
      })
      .catch(error => res.status(400).json({
        status: 'error',
        error
      }));
  }
}

export default CategoryController;
