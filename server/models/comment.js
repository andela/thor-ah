module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  Comment.associate = (models) => {
    const { User, Article, Reply } = models;
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
  };
  return Comment;
};
