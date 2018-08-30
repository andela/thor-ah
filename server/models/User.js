
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    hash: DataTypes.STRING,
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
