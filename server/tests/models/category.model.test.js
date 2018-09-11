import { expect } from 'chai';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';

import CategoryModel from '../../models/category';

describe.only('Category Model', () => {
  const Category = CategoryModel(sequelize, dataTypes);
  const category = new Category();

  checkModelName(Category)('Category');

  context('Category model properties', () => {
    ['name'].forEach(checkPropertyExists(category));
  });

  context('associations', () => {
    const Article = 'some dummy artcle';

    before(() => {
      Category.associate({ Article });
    });

    it('defined a belongsTo association with Article', () => {
      expect(Category.belongsTo).to.have.been.calledWith(Article);
    });
  });
});
