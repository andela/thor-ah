module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn(
      'Comments',
      'highlighted', {
        type: Sequelize.BOOLEAN,
      }
    ),
    queryInterface.addColumn(
      'Comments',
      'cssId', {
        type: Sequelize.STRING,
      }
    )
  ],

  down: queryInterface => [
    queryInterface.removeColumn(
      'Comments',
      'cssId'
    ),
    queryInterface.removeColumn(
      'Comments',
      'highlighted'
    )
  ]
};
