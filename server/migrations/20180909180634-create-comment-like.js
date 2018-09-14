module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentLikes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    username: {
      type: Sequelize.STRING,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'username',
      }
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
    reaction: {
      type: Sequelize.ENUM('liked', 'disliked'),
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('CommentLikes')
};
