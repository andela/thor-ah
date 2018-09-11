const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const CommentLikeModel = require('../../models/commentlike');

describe('comment model', () => {
  const CommentLike = CommentLikeModel(sequelize, dataTypes);
  const commentLike = new CommentLike();

  checkModelName(CommentLike)('CommentLike');
  // test comment model properties
  context('commentLike model properties', () => {
    [
      'userId',
      'commentId',
      'username'
    ].forEach(checkPropertyExists(commentLike));
  });

  context('associations', () => {
    const User = 'some user';
    const Comment = 'some comment';

    it('defined a belongsTo association with User', () => {
      CommentLike.associate({ User });
      expect(CommentLike.belongsTo.calledWith(User)).to.equal(true);
    });

    it('defined a belongsTo association with Article', () => {
      CommentLike.associate({ Comment });
      expect(CommentLike.belongsTo.calledWith(Comment)).to.equal(true);
    });
  });
});
