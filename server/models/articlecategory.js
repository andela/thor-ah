'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleCategory = sequelize.define('ArticleCategory', {
    articleId: DataTypes.INTEGER
  }, {});
  ArticleCategory.associate = function(models) {
    // associations can be defined here
  };
  return ArticleCategory;
};