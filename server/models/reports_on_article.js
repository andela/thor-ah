module.exports = (sequelize, DataTypes) => {
  const ReportsOnArticle = sequelize.define('ReportsOnArticle', {
    userId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    articleId: DataTypes.INTEGER,
    reasonForReport: {
      type: DataTypes.ENUM(
        'it has violent content',
        'this is hate speech',
        'this is false news',
        'it has pornographic content',
        'it is a spam',
        'other'
      ),
      allowNull: false,
    },
    reportBody: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});
  ReportsOnArticle.associate = (models) => {
    const { User, Article } = models;

    ReportsOnArticle.belongsTo(Article, {
      foreignKey: 'articleId',
      as: 'article'
    });

    ReportsOnArticle.belongsTo(User, {
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return ReportsOnArticle;
};
