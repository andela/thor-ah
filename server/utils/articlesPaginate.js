/**
 * @description - Paginates the articles collections
 *
 * @param {object} articles - articles details
 *
 * @param {Number} currentPage - Current page
 *
 * @param {Number} limit - Page limit
 *
 * @returns {object} pagination - Pagination object
 */

const paginateArticle = ({
  count = 0, rows = []
}, currentPage, limit) => {
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / limit);
  const newArticles = Object.assign(
    {
    },
    {
      currentPage,
      currentPageSize: rows.length,
      totalPages,
      totalRecords
    }
  );
  return newArticles;
};

export default paginateArticle;
