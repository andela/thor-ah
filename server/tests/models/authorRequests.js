import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import authorRequestsModel from '../../models/author_requests';

chai.should();

chai.use(chaiHttp);

describe('article model', () => {
  const authorRequests = authorRequestsModel(sequelize, dataTypes);
  const authorRequest = new authorRequests();

  checkModelName(authorRequests)('AuthorRequests');

  // test user model properties
  context('author requests model properties', () => {
    [
      'status',
      'feedback'
    ].forEach(checkPropertyExists(authorRequest));
  });
});
