module.exports = (sequelize, DataTypes) => {
  const ArticleView = sequelize.define('ArticleView', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
  }, {});
  ArticleView.associate = (models) => {
    const { Article } = models;
    ArticleView.belongsTo(Article, {
      as: 'article',
    });
  };
  return ArticleView;
};
