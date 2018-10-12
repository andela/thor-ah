module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ArticleCategories', [
    {
      articleId: 12,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 13,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 14,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 8,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 9,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 10,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 11,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 14,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 15,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      articleId: 16,
      categoryId: 23,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('ArticleCategories', null, {})
};
