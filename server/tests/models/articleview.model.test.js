import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ArticleViewModel from '../../models/articleview';

describe('Article view model', () => {
  const ArticleView = ArticleViewModel(sequelize, dataTypes);
  const articleView = new ArticleView();

  checkModelName(ArticleView)('ArticleView');

  // Test Article View Properties
  context('ArticleView model properties', () => {
    [
      'userId',
      'articleId'
    ].forEach(checkPropertyExists(articleView));
  });

  context('associations', () => {
    const Article = 'article of the year';

    it('defined a belongsTo association with Article', () => {
      ArticleView.associate({ Article });
      expect(ArticleView.belongsTo.calledWith(Article)).equal(true);
    });
  });
});
