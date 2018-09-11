module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'timeToRead',
    {
      type: Sequelize.INTEGER,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Articles',
    'timeToRead',
  )
};
