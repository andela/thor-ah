import calculateTimeToRead from '../utils/calculateTimeToRead';

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
    timeToRead: DataTypes.INTEGER,
    displayStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    hooks: {
      beforeCreate: (articleData) => {
        articleData.timeToRead = calculateTimeToRead(articleData);
      }
    }
  });

  Article.associate = (models) => {
    const {
      Comment, User, Tag, favoriteArticle, ReportsOnArticle
    } = models;
    // 1:m relationship
    Article.belongsTo(User, {
      as: 'author', foreignKey: 'authorId'
    });
    // m:m relationship
    Article.belongsToMany(Tag, {
      through: 'ArticleTags',
      as: 'tags',
      foreignKey: 'articleId',
    });
    Article.hasMany(Comment, {
      foreignKey: 'articleId'
    });
    Article.belongsToMany(models.Category, {
      through: {
        model: models.ArticleCategory,
      },
      foreignKey: 'articleId',
      as: 'article'
    });
    Article.hasMany(models.LikesDislikes, {
      foreignKey: 'articleId',
    });
    Article.hasMany(models.LikesDislikes, {
      foreignKey: 'articleId',
    });
    Article.hasMany(favoriteArticle, {
      foreignKey: 'articleId',
      as: 'favoriteArticles'
    });
    Article.hasMany(ReportsOnArticle, {
      foreignKey: 'articleId',
      as: 'reports'
    });
  };
  return Article;
};
