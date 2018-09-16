
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentHistories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    commentBody: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    commentId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Comments',
        key: 'id',
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('CommentHistories')
};
