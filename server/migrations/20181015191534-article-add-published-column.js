module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'published', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Articles',
    'published',
  )
};
