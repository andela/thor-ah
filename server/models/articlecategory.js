module.exports = (sequelize, DataTypes) => {
  const ArticleCategory = sequelize.define('ArticleCategory', {
    articleId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {});
  return ArticleCategory;
};
