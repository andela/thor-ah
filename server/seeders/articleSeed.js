
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles',
    [
      {
        authorId: 1,
        title: 'jbjkka2 kbviu buibi updated',
        body: 'ibin update1 cc',
        description: 'updfated kvilbulibvi',
        slug: 'gfvegybjcnwudj',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        authorId: 1,
        title: 'jbjkka2 kbviu buibi updated',
        body: 'ibin update1 cc',
        description: 'updfated kvilbulibvi',
        slug: 'ygehjnec',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        authorId: 1,
        title: 'jbjkka2 kbviu buibi updated',
        body: 'ibin update1 cc',
        description: 'updfated kvilbulibvi',
        slug: 'evbenjkve',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
