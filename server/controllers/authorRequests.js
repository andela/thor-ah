import { User, AuthorRequests } from '../models';
/**
 * @class authorsRequestController
 * @description controller to handle users requests to be authors
 */
class authorRequestsController {
  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static makeRequest(req, res, next) {
    const { userId, userRole } = req;

    if (userRole !== 'user') {
      return res.status(400).json({
        status: 'error',
        error: {
          message: userRole === 'admin' ? 'You cannot request to be an author.' : 'You are already an author.',
        },
      });
    }
    AuthorRequests.findOne({
      where: {
        status: 'pending',
        userId,
      },
    }).then((result) => {
      if (result) {
        return res.status(400).json({
          status: 'error',
          error: {
            message: 'You have a pending request.',
          }
        });
      }
      AuthorRequests.create({
        status: 'pending',
        userId,
      })
        .then(() => res.status(200).json({
          status: 'success',
          message: 'Request made successfully.',
        })).catch(err => err);
    }).catch(err => next(err));
  }

  /**
   * @description get all requests by an user
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getRequests(req, res, next) {
    const { userId } = req;
    const { paramsUserId } = req.params;

    const id = userId || paramsUserId;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid user ID provided',
        },
      });
    }

    AuthorRequests.findAll({
      where: {
        userId: id,
      },
    })
      .then(requests => res.status(200).json({
        status: 'success',
        requests,
      })).catch(err => next(err));
  }

  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getRequest(req, res, next) {
    const { requestId } = req.params;
    const { userId, userRole } = req;

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
        },
      });
    }

    AuthorRequests.findOne({
      where: {
        id: requestId,
      },
    })
      .then((request) => {
        if (!request) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'Request was not found.',
            },
          });
        }

        if (userRole !== 'admin') {
          if (request.userId !== userId) {
            return res.status(401).json({
              status: 'error',
              error: {
                message: 'You can not view a request that does not belong to you.',
              }
            });
          }
        }

        return res.status(200).json({
          status: 'success',
          request,
        });
      }).catch(err => next(err));
  }

  /**
   * @description delete a request
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static deleteARequest(req, res, next) {
    const { requestId } = req.params;
    const { userId } = req;

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
        },
      });
    }

    AuthorRequests.findOne({
      where: {
        id: requestId,
      }
    })
      .then((request) => {
        if (!request) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: 'You are trying to delete a request that does not exits.',
            },
          });
        }

        if (request.userId !== userId) {
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'You cannot delete a request that you did create.',
            },
          });
        }

        AuthorRequests.destroy({
          where: {
            id: requestId,
          }
        })
          .then(() => res.status(200).json({
            status: 'success',
            message: 'Request deleted successfully.',
          })).catch(err => next(err));
      }).catch(err => next(err));
  }

  /**
   * @description accept a user's author request
   * @param {obj} req request object
   * @param {obj} res request object
   * @param {obj} next Next action
   * @returns {json} return json response
   */
  static acceptRequest(req, res, next) {
    const { requestId } = req.params;
    const { userId, userRole } = req;

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
        },
      });
    }

    if (userRole !== 'admin') {
      return res.status(401).json({
        status: 'error',
        error: {
          message: 'You must be an admin to accept or reject a request.',
        },
      });
    }

    Promise.all([
      AuthorRequests.update({
        status: 'accepted',
      }, {
        where: {
          id: userId,
        },
      }),
      User.update({
        role: 'author',
      }, {
        where: {
          id: userId,
        },
      })
    ])
      .then(() => res.status(200).json({
        status: 'success',
        message: 'Request accepted.',
      })).catch(err => next(err));
  }

  /**
   * @description reject a user's author request
   * @param {obj} req request object
   * @param {obj} res request object
   * @param {obj} next Next action
   * @returns {json} return json response
   */
  static rejectRequest(req, res, next) {
    const { requestId } = req.params;
    const { feedback } = req.body;
    const { userId, userRole } = req;

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
        },
      });
    }

    if (userRole !== 'admin') {
      return res.status(401).json({
        status: 'error',
        error: {
          message: 'You must be an admin to accept or reject a request.',
        },
      });
    }

    if (!feedback || feedback.trim().length < 20) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'You must provide a feedback for rejecting a request.',
        },
      });
    }

    AuthorRequests.update({
      status: 'rejected',
      feedback,
    }, {
      where: {
        id: userId,
      },
    })
      .then(() => res.status(200).json({
        status: 'success',
        message: 'Request rejected.',
      })).catch(err => next(err));
  }
}

export default authorRequestsController;
