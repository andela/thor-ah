import isEmpty from './is_empty';


/**
 *
 * @description controller class for article validation
 *  @class articleController
 */
class articleValidation {
  /**
   *  @description method for validation of create article input
   *  @param {object} data body of the create article's request
   *  @returns {object} The body of  the response message
   */
  static validateArticle(data) {
    const error = {};
    data.title = data.title ? data.title : '';
    data.description = data.description ? data.description : '';
    data.body = data.body ? data.body : '';
    if (!(data.title)) {
      error.title = 'Please provide article title';
    }
    if (!(data.description)) {
      error.description = 'Please article description';
    }
    if (!(data.body)) {
      error.body = 'Please supply article body';
    }
    return {
      error,
      isValid: isEmpty(error),
      status: 'error'
    };
  }

  /**
   *  @description method for validation of tag input
   *  @param {object} data
   *  @returns {object} response message
   */
  static validateTag(data) {
    const error = {};
    data.tag = data.tag ? data.tag : '';

    if (!data.tag) {
      error.tag = 'Tag name is required';
    }
    return {
      error,
      isValid: isEmpty(error),
      status: 'error'
    };
  }
}
export default articleValidation;
