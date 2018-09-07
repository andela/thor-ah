import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import userFollowModel from '../../models/userFollow';

chai.should();

chai.use(chaiHttp);

describe('userfollow model', () => {
  const Follow = userFollowModel(sequelize, dataTypes);
  const userFollow = new Follow();

  checkModelName(Follow)('UserFollow');

  // test user model properties
  context('userFollow model properties', () => {
    [
      'userId',
      'followerId'
    ].forEach(checkPropertyExists(userFollow));
  });
});
