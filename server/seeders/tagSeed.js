module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Tags',
    [
      {
        tag: 'walker',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
