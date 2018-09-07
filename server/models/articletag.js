module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    tagId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  ArticleTag.associate = () => {
    // associations can be defined here
  };
  return ArticleTag;
};
