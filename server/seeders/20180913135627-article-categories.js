module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ArticleCategories', [
    { articleId: 1 },
    { articleId: 2 },
    { articleId: 3 },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Person', null, {})
};
