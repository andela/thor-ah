module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false
    },
    articleSlug: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }).then(() => queryInterface.addConstraint('Notifications', ['userId', 'articleSlug'], {
    type: 'unique',
    name: 'custom_unique_constraint_name'
  })),

  down: queryInterface => queryInterface.dropTable('Notifications')
};
