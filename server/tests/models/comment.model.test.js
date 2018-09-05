const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const CommentModel = require('../../models/comment');

describe('comment model', () => {
  const Comment = CommentModel(sequelize, dataTypes);
  const comment = new Comment();

  checkModelName(Comment)('Comment');
  // test comment model properties
  context('comment model properties', () => {
    [
      'comment'
    ].forEach(checkPropertyExists(comment));
  });

  context('associations', () => {
    const User = 'some user';
    const Article = 'some article';
    const Reply = 'some reply';

    it('defined a belongsTo association with User', () => {
      Comment.associate({ User });
      expect(Comment.belongsTo.calledWith(User)).to.equal(true);
    });

    it('defined a belongsTo association with Article', () => {
      Comment.associate({ Article });
      expect(Comment.belongsTo.calledWith(Article)).to.equal(true);
    });

    it('defined a hasMany association with Reply', () => {
      Comment.associate({ Reply });
      expect(Comment.hasMany.calledWith(Reply)).to.equal(true);
    });
  });
});
