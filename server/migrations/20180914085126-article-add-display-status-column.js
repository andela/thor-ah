module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'displayStatus',
    {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Articles',
    'displayStatus',
  )
};
