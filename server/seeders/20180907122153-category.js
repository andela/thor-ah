module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Categories', [
    {
      name: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Business',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Politics',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Health',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Entrepreneurship',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
