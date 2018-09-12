import { Category, Article, ArticleCategory } from '../models';

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
    const name = req.body.name.trim();
    const newCategory = `${name.substr(0, 1).toUpperCase()}${name.slice(1).toLowerCase()}`;
    if (newCategory === '') {
      return res.status(400).json({
        status: 'error',
        error: 'Name field cannot be empty'
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
          .then(createdCategory => (
            res.status(201).json({
              status: 'success',
              createdCategory
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
   * @description Updates an existing category
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
   * @description Delete an existing category
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
            error: 'You cannot delete a category does not exist'
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
    const { articleId } = req.body;
    const { categoryName } = req.params;
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
        return Article.findOne(({
          where: { id: articleId }
        }))
          .then((article) => {
            if (!article) {
              return res.status(404).json({
                status: 'error',
                error: 'Article does not exist'
              });
            }
            const categoryId = category.id;
            const { userId } = req;
            if (parseInt(article.authorId, 10) !== parseInt(userId, 10)) {
              return res.status(403).json({
                status: 'error',
                error: 'You do not have sufficient permissions for this action'
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
                return ArticleCategory.count({
                  where: { articleId }
                })
                  .then((articleCount) => {
                    if (parseInt(articleCount, 10) === 3) {
                      return res.status(406).json({
                        status: 'error',
                        error: 'You cannot have more than 3 categories for each article'
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
                  });
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
   * @description Get all articles in a category
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
            error: 'There are no articles in this category'
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
   * @description Remove an article from a category
   * @param  {object} req body of the Author's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static removeArticleFromACategory(req, res) {
    const { articleId } = req.body;
    const { categoryName } = req.params;

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
          where: { id: articleId }
        }))
          .then((article) => {
            if (!article) {
              return res.status(404).json({
                status: 'error',
                error: 'Article does not exist'
              });
            }
            const categoryId = category.id;
            const { userId } = req;
            if (parseInt(article.authorId, 10) !== userId) {
              return res.status(403).json({
                status: 'error',
                error: 'You do not have sufficient permissions for this action',
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
