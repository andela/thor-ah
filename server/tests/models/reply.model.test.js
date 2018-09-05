const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const ReplyModel = require('../../models/reply');

describe('reply model', () => {
  const Reply = ReplyModel(sequelize, dataTypes);
  const reply = new Reply();

  checkModelName(Reply)('Reply');
  // test reply model properties
  context('reply model properties', () => {
    [
      'reply'
    ].forEach(checkPropertyExists(reply));
  });

  context('associations', () => {
    const User = 'some user';
    const Comment = 'some comment';

    it('defined a belongsTo association with User', () => {
      Reply.associate({ User });
      expect(Reply.belongsTo.calledWith(User)).to.equal(true);
    });

    it('defined a belongsTo association with Comment', () => {
      Reply.associate({ Comment });
      expect(Reply.belongsTo.calledWith(Comment)).to.equal(true);
    });
  });
});
