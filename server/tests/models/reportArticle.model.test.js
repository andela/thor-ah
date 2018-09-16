const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');
const { expect } = require('chai');

const ReportOnArticleModels = require('../../models/reports_on_article');

describe('Article reports model', () => {
  const ReportsOnArticle = ReportOnArticleModels(sequelize, dataTypes);
  const reportOnArticle = new ReportsOnArticle();

  checkModelName(ReportsOnArticle)('ReportsOnArticle');

  context('model properties for ReportOnArticle', () => {
    [
      'userId',
      'articleId',
      'username',
      'reasonForReport',
      'reportBody'
    ].forEach(checkPropertyExists(reportOnArticle));
  });

  context('associations', () => {
    const User = 'some user';
    const Article = 'some article';

    it('defined a belongsTo association with User', () => {
      ReportsOnArticle.associate({ User });
      expect(ReportsOnArticle.belongsTo.calledWith(User)).to.equal(true);
    });

    it('defined a belongsTo association with Article', () => {
      ReportsOnArticle.associate({ Article });
      expect(ReportsOnArticle.belongsTo.calledWith(Article)).to.equal(true);
    });
  });
});
