module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    bio: Sequelize.STRING,
    role: {
      type: Sequelize.ENUM('admin', 'user', 'author'),
      allowNull: false,
      defaultValue: 'user',
    },
    image: Sequelize.STRING,
<<<<<<< HEAD
    twitter: Sequelize.STRING,
    linkedin: Sequelize.STRING,
    hash: {
      type: Sequelize.STRING,
      allowNull: false,
=======
    hash: Sequelize.STRING,
    salt: Sequelize.STRING,
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
<<<<<<< HEAD
      type: Sequelize.DATE,
=======
      type: Sequelize.DATE
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
    },
  }),
  down: queryInterface => queryInterface.dropTable('Users'),
};
