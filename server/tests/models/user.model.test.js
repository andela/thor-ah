import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';

import { expect } from 'chai';

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

  context('associations', () => {
    const Article = 'some article';
    const Comment = 'some comment';
    const Reply = 'some reply';
<<<<<<< HEAD
    const CommentLikesDislike = 'some like';
=======
    const CommentLike = 'some like';
>>>>>>> feat(commentLikesDislikes): endpoint to like or dislike comments on articles

    it('defined a belongsToMany association with User', () => {
      User.associate({ User });
      expect(User.belongsToMany.calledWith(User)).to.equal(true);
    });
    it('defined a hasMany association with Articles', () => {
      User.associate({ Article });
      expect(User.hasMany.calledWith(Article)).to.equal(true);
    });
    it('defined a hasMany association with Comments', () => {
      User.associate({ Comment });
      expect(User.hasMany.calledWith(Comment)).to.equal(true);
    });
    it('defined a hasMany association with Replies', () => {
      User.associate({ Reply });
      expect(User.hasMany.calledWith(Reply)).to.equal(true);
    });
    it('defined a hasMany association with CommentLikes', () => {
<<<<<<< HEAD
      User.associate({ CommentLikesDislike });
      expect(User.hasMany.calledWith(CommentLikesDislike)).to.equal(true);
=======
      User.associate({ CommentLike });
      expect(User.hasMany.calledWith(CommentLike)).to.equal(true);
>>>>>>> feat(commentLikesDislikes): endpoint to like or dislike comments on articles
    });
  });
});
