
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Replies', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    reply: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commenterId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    commentId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Comments',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    }
  }),
  down: queryInterface => queryInterface.dropTable('Replies')
};
