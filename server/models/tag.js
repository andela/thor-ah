module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Tag.associate = (models) => {
    // m:m relationship
    Tag.belongsToMany(models.Article, {
      through: 'ArticleTags',
      as: 'articles',
      foreignKey: 'tagId',
    });
  };
  return Tag;
};
