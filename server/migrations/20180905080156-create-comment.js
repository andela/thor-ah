
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    body: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commenterId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    articleId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'Articles',
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
  down: queryInterface => queryInterface.dropTable('Comments')
};
