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
    {
      name: 'Comics',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Culture',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Film',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Food',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Music',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Sports',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Economy',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Leadership',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Productivity',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Gaming',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Blockchain',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Artificial Intelligence',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Programming',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Science',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Family',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Personal Finance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Design',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
