const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const SubscriptionModel = require('../../models/subscription');

describe('comment model', () => {
  const Subscription = SubscriptionModel(sequelize, dataTypes);
  const subscription = new Subscription();

  checkModelName(Subscription)('Subscription');

  context('subscription model properties', () => {
    [
      'userId',
      'plan',
      'paymentDate',
      'transactionKey'
    ].forEach(checkPropertyExists(subscription));
  });

  context('associations', () => {
    const User = 'some user';

    it('defined a belongsTo association with User', () => {
      Subscription.associate({ User });
      expect(Subscription.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
