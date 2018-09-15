import { expect } from 'chai';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import articleModel from '../../models/article';

describe('article model', () => {
  const Article = articleModel(sequelize, dataTypes);
  const article = new Article();

  checkModelName(Article)('Article');

  // test user model properties
  context('article model properties', () => {
    [
      'title',
      'slug',
      'description',
      'authorId'
    ].forEach(checkPropertyExists(article));
  });

  context('associations', () => {
    const Category = 'Technology';
    const Tag = 'Braniac';
    const Comment = 'good job';
    const LikesDislikes = 'like';
    const favoriteArticle = 'Coding';

    it('defined a belongsToMany association with Category', () => {
      Article.associate({ Category });
      expect(Article.belongsToMany.calledWith(Category)).equal(true);
    });

    it('defined a belongsToMany association with Tags', () => {
      Article.associate({ Tag });
      expect(Article.belongsToMany.calledWith(Tag)).equal(true);
    });

    it('defined a hasMany association with Comment', () => {
      Article.associate({ Comment });
      expect(Article.hasMany.calledWith(Comment)).equal(true);
    });

    it('defined a hasMany association with LikesDislikes', () => {
      Article.associate({ LikesDislikes });
      expect(Article.hasMany.calledWith(LikesDislikes)).equal(true);
    });

    it('defined a hasMany association with LikesDislikes', () => {
      Article.associate({ LikesDislikes });
      expect(Article.hasMany.calledWith(LikesDislikes)).equal(true);
    });

    it('defined a hasMany association with favoriteArticle', () => {
      Article.associate({ favoriteArticle });
      expect(Article.hasMany.calledWith(favoriteArticle)).equal(true);
    });
  });
});
