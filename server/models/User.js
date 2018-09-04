
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bio: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'author'),
      allowNull: false,
      defaultValue: 'user',
    },
    image: {
      type: DataTypes.STRING,
    },
    twitter: {
      type: DataTypes.STRING,
    },
    linkedin: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
<<<<<<< HEAD
=======
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    hash: DataTypes.STRING,
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
  }, {
    hooks: {
      beforeCreate: (userSignupData) => {
        // hash and reassign password using bcrypt
        userSignupData.hash = bcrypt.hashSync(userSignupData.hash, 10);
      }
    }
  });
  User.associate = function () { // eslint-disable-line func-names
    // associations can be defined here
    // TODO: add table associations to "Article" for favorites column
    // TODO: add table associations to "User" for following column
  };
  return User;
};
