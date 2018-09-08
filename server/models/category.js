module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique: true
    },
  });
  Category.associate = (models) => {
    Category.belongsToMany(models.Article, {
      through: {
        model: models.ArticleCategory,
      },
      foreignKey: 'categoryId',
      as: 'category',
    });
  };
  return Category;
};
