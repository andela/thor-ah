import { User, AuthorRequests } from '../models';
/**
 * @class authorRequestsController
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
  static makeARequest(req, res, next) {
    const { userId } = req;
    User.findById(userId)
      .then((user) => {
        if (user.role !== 'user') {
          return res.status(400).json({
            status: 'error',
            error: {
              message: user.role === 'admin' ? 'An admin cannot request to be an author.' : 'You are already an author.',
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
              message: 'Request successful.',
            })).catch(err => err);
        }).catch(next);
      }).catch(next);
  }

  /**
   * @description get all requests
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getAllRequests(req, res, next) {
    const { status } = req.query;

    const where = !status ? {} : {
      where: {
        status,
      },
    };

    AuthorRequests.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      where: where.where,
    })
      .then(requests => res.status(200).json({
        status: 'success',
        requests,
      })).catch(next);
  }

  /**
   * @description get all requests by an user
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getRequestsByAUser(req, res, next) {
    const { userId, userRole } = req;
    const { paramsUserId } = req.params;

    const id = userRole !== 'user' ? paramsUserId : userId;

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
      })).catch(next);
  }

  /**
   * @description make a request to be an author
   * @param {obj} req request object
   * @param {obj} res response object
   * @param {obj} next next action
   * @returns {json} return json response
   */
  static getOneRequest(req, res, next) {
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

        if (userRole !== 'superAdmin') {
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
        }

        return res.status(200).json({
          status: 'success',
          request,
        });
      }).catch(next);
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
              message: 'You are trying to delete a request that does not exist.',
            },
          });
        }

        if (request.userId !== userId) {
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'You cannot delete a request that you did not make.',
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
            message: 'Request deleted.',
          })).catch(next);
      }).catch(next);
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
              message: 'You are trying to respond to a request that does not exist.',
            }
          });
        }

        if (request.status !== 'pending') {
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'You cannot accept a request that has been responded to.',
            }
          });
        }

        Promise.all([
          AuthorRequests.update({
            status: 'accepted',
          }, {
            where: {
              id: requestId,
            },
          }),
          User.update({
            role: 'author',
          }, {
            where: {
              id: request.userId,
            },
          })
        ])
          .then(() => res.status(200).json({
            status: 'success',
            message: 'Request accepted.',
          })).catch(next);
      }).catch(next);
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

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
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
              message: 'You are trying to respond to a request that does not exist.',
            }
          });
        }
        if (request.status !== 'pending') {
          return res.status(400).json({
            status: 'error',
            error: {
              message: 'You cannot reject a request that has been responded to.',
            }
          });
        }

        AuthorRequests.update({
          status: 'rejected',
          feedback,
        }, {
          where: {
            id: requestId,
          },
        })
          .then(() => res.status(200).json({
            status: 'success',
            message: 'Request rejected.',
          })).catch(next);
      }).catch(next);
  }

  /**
   * @description Admin - Delete a request
   * @param {obj} req request object
   * @param {obj} res request object
   * @param {obj} next Next action
   * @returns {json} return json response
   */
  static deleteUsersRequest(req, res, next) {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'No valid request ID provided.',
        }
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
              message: 'The request you are trying to delete does not exist.',
            },
          });
        }

        request.destroy().then(() => res.status(200).json({
          status: 'success',
          message: 'Request deleted.',
        })).catch(next);
      }).catch(next);
  }
}

export default authorRequestsController;
