
module.exports = (sequelize, DataTypes) => {
  const favoriteArticle = sequelize.define('favoriteArticle', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  favoriteArticle.associate = (models) => {
    const { User, Article } = models;
    favoriteArticle.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    favoriteArticle.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return favoriteArticle;
};
