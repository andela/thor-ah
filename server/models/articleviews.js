module.exports = (sequelize, DataTypes) => {
  const ArticleViews = sequelize.define('ArticlViews', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    view: DataTypes.INTEGER
  }, {});
  ArticleViews.associate = (models) => {
    const { Article } = models;
    ArticleViews.belongsTo(Article, {
      foreignKey: 'articleId'
    });
  };
  return ArticleViews;
};
