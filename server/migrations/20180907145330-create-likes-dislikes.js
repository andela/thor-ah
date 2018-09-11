module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('LikesDislikes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reaction: {
      type: Sequelize.ENUM(0, 1),
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
  down: queryInterface => queryInterface.dropTable('LikesDislikes'),
};
