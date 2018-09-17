module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ArticleCategories', [
    {
      articleId: 1,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 2,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('ArticleCategories', null, {})
};
