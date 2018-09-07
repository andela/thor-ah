module.exports = (sequelize, DataTypes) => {
  const UserFollow = sequelize.define('UserFollow', {
    userId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});

  return UserFollow;
};
