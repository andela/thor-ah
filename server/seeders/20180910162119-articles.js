module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    {
      title: 'wildlife conservation',
      body: 'The conseration of wildlife is essential to ensure the ecosystem is kept in tact',
      description: 'wildlife',
      slug: 'wildlife-conservation',
      authorId: 1,
      displayStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'staying fit',
      body: 'To stay fit, eat well, exercise daily and visit your doctor monthly',
      description: 'fitness',
      slug: 'staying-fit',
      authorId: 2,
      displayStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Eating good food',
      body: 'Food is an important factor in life. Eating good food is another one',
      description: 'wildlife',
      slug: 'Eating-good-food',
      authorId: 1,
      displayStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'living the good life',
      body: 'Brace each day with enough motivation and excitement',
      description: 'fitness',
      slug: 'living-the-good-life',
      authorId: 2,
      displayStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Person', null, {})
};
