module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: DataTypes.STRING,
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likeDislikeId: DataTypes.INTEGER
  }, {});

  Article.associate = (models) => {
    const { Comment } = models;
    // 1:m relationship
    Article.belongsTo(models.User, {
      as: 'author', foreignKey: 'authorId'
    });
    // m:m relationship
    Article.belongsToMany(models.Tag, {
      through: 'ArticleTags',
      as: 'tags',
      foreignKey: 'articleId',
    });

    Article.hasMany(Comment);
  };
  return Article;
};
