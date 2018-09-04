import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';

import UserModel from '../../models/User';

describe('user model', () => {
  const User = UserModel(sequelize, dataTypes);
  const user = new User();

  checkModelName(User)('User');

  // test user model properties
  context('user model properties', () => {
    [
      'firstName',
      'lastName',
      'username',
      'email',
      'bio',
      'role',
      'image',
      'twitter',
      'linkedin',
      'hash'
    ].forEach(checkPropertyExists(user));
  });
});
