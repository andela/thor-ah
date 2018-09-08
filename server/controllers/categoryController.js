import { Category } from '../models';

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
   * @param  {object} req body of the user's request
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
    Category.findOne({
      where: { name: newCategory }
    })
      .then((category) => {
        if (category) {
          return res.status(409).json({
            status: 'error',
            error: 'Category already exists'
          });
        }
        Category.create({
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
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static updateCategory(req, res) {
    const { categoryName } = req.params;
    return Category.findOne({
      where: { name: categoryName }
    })
      .then((category) => {
        if (!category) {
          return res.status(404).json({
            status: 'error',
            error: 'Category does not exist'
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
   * @param  {object} req body of the user's request
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
            message: 'Category does not exist'
          });
        }
        return category.destroy()
          .then(() => (
            res.status(204).json({
              status: 'success',
              message: 'Category deleted successfully'
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
}

export default CategoryController;
