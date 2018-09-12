module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  Comment.associate = (models) => {
    const {
      User, Article, Reply, CommentLikesDislike
    } = models;
    Comment.belongsTo(User, {
      as: 'commenter',
      onDelete: 'CASCADE',
    });

    Comment.belongsTo(Article, {
      onDelete: 'CASCADE',
      foreignKey: 'articleId',
      as: 'article'
    });

    Comment.hasMany(Reply, {
      foreignKey: 'commentId',
      // as: 'commentReply'
    });

    Comment.hasMany(CommentLikesDislike, {
      foreignKey: 'commentId',
      as: 'likes',
    });
    Comment.hasMany(CommentLikesDislike, {
      foreignKey: 'commentId',
      as: 'dislikes',
    });
  };
  return Comment;
};
