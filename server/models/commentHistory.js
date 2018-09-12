module.exports = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    commentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Comment);
  };
  return CommentHistory;
};
