module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'ArticleTags',
    [
      {
        tagId: 1,
        articleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tagId: 1,
        articleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tagId: 1,
        articleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}
  ),

  down: queryInterface => queryInterface.bulkDelete('ArticleTags', null, {})
};
