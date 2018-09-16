const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const CommentHistoryModel = require('../../models/commentHistory');

describe('comment history model', () => {
  const CommentHistory = CommentHistoryModel(sequelize, dataTypes);
  const commentHistory = new CommentHistory();

  checkModelName(CommentHistory)('CommentHistory');
  // test commentHistory model properties
  context('comment history model properties', () => {
    [
      'commentBody'
    ].forEach(checkPropertyExists(commentHistory));
  });

  context('associations', () => {
    const Comment = 'some comment';

    it('defined a belongsTo association with Comment', () => {
      CommentHistory.associate({ Comment });
      expect(CommentHistory.belongsTo.calledWith(Comment)).to.equal(true);
    });
  });
});
