import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import articleModel from '../../models/article';

chai.should();

chai.use(chaiHttp);

describe('article model', () => {
  const Article = articleModel(sequelize, dataTypes);
  const article = new Article();

  checkModelName(Article)('Article');

  // test user model properties
  context('article model properties', () => {
    [
      'title',
      'slug',
      'description',
      'authorId'
    ].forEach(checkPropertyExists(article));
  });
});
