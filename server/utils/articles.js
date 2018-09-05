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
    const errors = {};
    data.title = data.title ? data.title : '';
    data.description = data.description ? data.description : '';
    data.body = data.body ? data.body : '';
    if (!(data.title)) {
      errors.title = 'Please provide article title';
    }
    if (!(data.description)) {
      errors.description = 'Please article description';
    }
    if (!(data.body)) {
      errors.body = 'Please supply article body';
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}
export default articleValidation;
