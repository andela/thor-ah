module.exports = (sequelize, DataTypes) => {
  const LikesDislikes = sequelize.define('LikesDislikes', {
    status: {
      type: DataTypes.ENUM('liked', 'disliked'),
      allowNull: false,
    },
  }, {});
  LikesDislikes.associate = (models) => {
    const { User, Article } = models;
    LikesDislikes.belongsTo(Article, {
      as: 'article',
      foreignKey: 'articleId',
    });
    LikesDislikes.belongsTo(User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
  };
  return LikesDislikes;
};
