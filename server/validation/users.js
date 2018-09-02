import validator from 'validator';
import isEmpty from '../utils/is_empty';

/**
 *
 * @description controller class with for users input validation
 *  @class UserController
 */
class UserValidation {
  /**
   * @description method for validation of login input
   * @param  {object} data  body of the user's request
   * @returns {object} The body of the response message
   */
  static validateLoginInput(data) {
    const errors = {};

    data.email = data.email ? data.email : '';
    data.password = data.password ? data.password : '';


    if (!(data.email)) {
      errors.email = 'Please enter your registered email';
    }

    if (!(data.password)) {
      errors.password = 'Please enter your password';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  /**
   * @description method for validation of profile update
   * @param  {object} data  body of the user's request
   * @returns {object} The body of the response message
   */
  static validateProfileInput(data) {
    const errors = {};

    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.username = !isEmpty(data.username) ? data.username : '';
    data.bio = !isEmpty(data.bio) ? data.bio : '';
    data.image = !isEmpty(data.image) ? data.image : '';
    data.twitter = !isEmpty(data.twitter) ? data.twitter : '';
    data.linkedin = !isEmpty(data.linkedin) ? data.linkedin : '';

    if (!validator.isEmpty(data.username) && !validator.isLength(data.username, {
      min: 2, max: 15
    })) {
      errors.username = 'Username should to be between 2 and 15 characters';
    }

    if (!validator.isEmpty(data.firstName) && !validator.isLength(data.firstName, {
      min: 1, max: 20
    })) {
      errors.firstName = 'First name should not be more than 20 characters';
    }

    if (!validator.isEmpty(data.lastName) && !validator.isLength(data.lastName, {
      min: 1, max: 20
    })) {
      errors.lastName = 'Last name should not be more than 20 characters';
    }

    if (!isEmpty(data.twitter)) {
      if (!validator.isURL(data.twitter)) {
        errors.twitter = 'twitter URL is not valid';
      }
    }

    if (!isEmpty(data.linkedin)) {
      if (!validator.isURL(data.linkedin)) {
        errors.linkedin = 'linkedin URL is not valid';
      }
    }


    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

export default UserValidation;
