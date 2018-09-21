module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Subscriptions',
    [
      {
        userId: 3,
        plan: 'basic',
        paymentDate: '2017-08-20 09:33:53',
        transactionKey: 'ibin update1 cc',
        expiryDate: '2018-08-20 09:33:53',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        plan: 'basic',
        paymentDate: '2017-08-20 09:33:53',
        transactionKey: 'ibin update1 cc',
        expiryDate: '2018-08-20 09:33:53',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        plan: 'premium',
        paymentDate: new Date(),
        transactionKey: 'ibin update1 cc',
        expiryDate: '2019-08-20 09:33:53',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Subscriptions', null, {})
};
