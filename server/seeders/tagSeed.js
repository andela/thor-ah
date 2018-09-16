module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Tags',
    [
      {
        tag: 'walker',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tag: 'tech',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tag: 'andela',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tag: 'wildlife',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tag: 'agric',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
