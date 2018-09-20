module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'active',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'active',
  )
};
