const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const CommentLikesDislikeModel = require('../../models/comment_like_dislike');

describe('comment model', () => {
  const CommentLikesDislike = CommentLikesDislikeModel(sequelize, dataTypes);
  const commentLikeDislike = new CommentLikesDislike();

  checkModelName(CommentLikesDislike)('CommentLikesDislike');
  // test comment model properties
  context('commentLike model properties', () => {
    [
      'userId',
      'commentId',
      'username'
    ].forEach(checkPropertyExists(commentLikeDislike));
  });

  context('associations', () => {
    const User = 'some user';
    const Comment = 'some comment';

    it('defined a belongsTo association with User', () => {
      CommentLikesDislike.associate({ User });
      expect(CommentLikesDislike.belongsTo.calledWith(User)).to.equal(true);
    });

    it('defined a belongsTo association with Article', () => {
      CommentLikesDislike.associate({ Comment });
      expect(CommentLikesDislike.belongsTo.calledWith(Comment)).to.equal(true);
    });
  });
});
