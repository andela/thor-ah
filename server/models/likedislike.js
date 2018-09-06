module.exports = (sequelize, DataTypes) => {
  const LikeDislike = sequelize.define('likeDislike', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('liked', 'disliked'),
      allowNull: false,
    },
  }, {});
  LikeDislike.associate = () => {
    // associations can be defined here
  };
  return LikeDislike;
};
