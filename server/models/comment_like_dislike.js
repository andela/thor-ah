module.exports = (sequelize, DataTypes) => {
  const CommentLikesDislike = sequelize.define('CommentLikesDislike', {
    userId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    commentId: DataTypes.INTEGER,
    reaction: {
      type: DataTypes.ENUM(0, 1),
      allowNull: false,
    },
  }, {});
  CommentLikesDislike.associate = (models) => {
    const { Comment, User } = models;
    CommentLikesDislike.belongsTo(Comment, {
      onDelete: 'CASCADE',
      foreignKey: 'commentId',
      as: 'comment'
    });

    CommentLikesDislike.belongsTo(User, {
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return CommentLikesDislike;
};
