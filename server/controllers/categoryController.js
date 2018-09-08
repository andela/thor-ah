import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Category, Article } from '../models';

dotenv.config();

const secret = process.env.SECRET_KEY;

/**
 *
 * @description controller class with methods for email verification and confirmation
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
    Category.findAll({
      include: [{
        as: 'article'
      }]
    });
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static createCategory(req, res) {

  }

  /**
   * @description Create a new category
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static removeCategory(req, res) {
    
  }

  /**
   * @description Create a new category
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @returns {object} The body of the response message
   * @memberof CategoryController
   */
  static editCategory(req, res) {
    
  }
}

export default CategoryController;
