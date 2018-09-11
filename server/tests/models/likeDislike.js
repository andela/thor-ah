import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import likesDislikesModel from '../../models/likes_dislikes';

chai.should();

chai.use(chaiHttp);

describe('article model', () => {
  const likesDislikes = likesDislikesModel(sequelize, dataTypes);
  const likeDislike = new likesDislikes();

  checkModelName(likesDislikes)('LikesDislikes');

  // test user model properties
  context('article model properties', () => {
    [
      'reaction'
    ].forEach(checkPropertyExists(likeDislike));
  });
});
