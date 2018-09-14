module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReportsOnArticles', {
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
    reasonForReport: {
      type: Sequelize.ENUM(
        'it has violent content',
        'this is hate speech',
        'this is false news',
        'it has pornographic content',
        'it is a spam',
        'other'
      ),
      allowNull: false,
    },
    reportBody: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: queryInterface => queryInterface.dropTable('ReportsOnArticles')
};
