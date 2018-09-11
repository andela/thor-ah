module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    userId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    commentId: DataTypes.INTEGER,
    reaction: {
      type: DataTypes.ENUM('liked', 'disliked'),
      allowNull: false,
    },
  }, {});
  CommentLike.associate = (models) => {
    const { Comment, User } = models;
    CommentLike.belongsTo(Comment, {
      onDelete: 'CASCADE',
      foreignKey: 'commentId',
      as: 'comment'
    });

    CommentLike.belongsTo(User, {
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return CommentLike;
};
