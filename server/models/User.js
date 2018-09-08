
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
    userFollowId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (userSignupData) => {
        // hash and reassign password using bcrypt
        userSignupData.hash = bcrypt.hashSync(userSignupData.hash, 10);
      }
    }
  });

  User.associate = (models) => {
    User.belongsToMany(models.User, {
      through: {
        model: models.UserFollow,
      },
      as: 'followers',
      foreignKey: 'userId',
    });

    User.belongsToMany(models.User, {
      through: {
        model: models.UserFollow,
      },
      as: 'following',
      foreignKey: 'followerId',
    });

    User.hasMany(models.Article, {
      foreignKey: 'authorId',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'commenterId'
    });
    User.hasMany(models.Reply, {
      foreignKey: 'commenterId',
      // as: 'replies',
    });
  };
  return User;
};
