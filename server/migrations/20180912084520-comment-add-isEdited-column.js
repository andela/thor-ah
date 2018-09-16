module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Comments',
    'isEdited', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Comments',
    'isEdited',
  )
};
