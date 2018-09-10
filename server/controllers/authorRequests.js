/**
 * @class authorsController
 */
class authorsController {
  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static makeARequest(req, res, next) {
    const { userId, role } = req;

    if (role !== 'user') {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'You cannot make a request to be an author.',
        },
      });
    }
    next(userId);
  }

  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getAllRequests(req, res, next) {
    next(res);
  }

  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getOneRequest(req, res, next) {
    next(res);
  }

  /**
   * @description delete a request
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static deleteARequest(req, res, next) {
    next(res);
  }
}

export default authorsController;
