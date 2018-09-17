import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ArticleViewHistoryModel from '../../models/articleViewHistory';

describe('Article view model', () => {
  const ArticleViewHistory = ArticleViewHistoryModel(sequelize, dataTypes);
  const articleViewHistory = new ArticleViewHistory();

  checkModelName(ArticleViewHistory)('ArticleViewHistory');

  // Test Article View Properties
  context('ArticleViewHistory model properties', () => {
    [
      'userId',
      'articleId'
    ].forEach(checkPropertyExists(articleViewHistory));
  });

  context('associations', () => {
    const Article = 'article of the year';

    it('defined a belongsTo association with Article', () => {
      ArticleViewHistory.associate({ Article });
      expect(ArticleViewHistory.belongsTo.calledWith(Article)).equal(true);
    });
  });
});
