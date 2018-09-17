module.exports = (sequelize, DataTypes) => {
  const ArticleViewHistory = sequelize.define('ArticleViewHistory', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
  }, {});
  ArticleViewHistory.associate = (models) => {
    const { Article } = models;
    ArticleViewHistory.belongsTo(Article, {
      as: 'article',
    });
  };
  return ArticleViewHistory;
};
