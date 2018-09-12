// import { User, Article, ArticleViews, Category } from '../models';

// /**
//  *
//  * @description controller class with methods for categorizing articles
//  * @class RedingStatsController
//  */
// class ReadingStatsController {
//   /**
//    * @description Get all categories
//    * @param  {object} req body of the user's request
//    * @param  {function} res response from the server
//    * @returns {object} The body of the response message
//    * @memberof ReadingStatsController
//    */
//   static getAllReadingStats(req, res) {
//     const userId = req;

//   }

//   /**
//    * @description Get all categories
//    * @param  {object} req body of the user's request
//    * @param  {function} res response from the server
//    * @returns {object} The body of the response message
//    * @memberof ReadingStatsController
//    */
//   static getMostReadCategory(req, res) {

//   }

//   /**
//    * @description Count the articles that a user reads
//    * @param  {object} req body of the user's request
//    * @param  {function} res response from the server
//    * @returns {object} The body of the response message
//    * @memberof ReadingStatsController
//    */
//   static articlesReadCount(req, res) {
//     const { userId, articleId } = req;
//     console.log({ userId, articleId });
//     ArticleViews.findOne({
//       where: { articleId, userId }
//     })
//       .then((articlePresent) => {
//         if (articlePresent) {
//           return;
//         }
//         return ArticleViews.create({
//           where: { articleId, userId }
//         })
//           .then(created => res.status(201).json({
//             status: 'success',
//             created
//           }))
//           .catch(error => (
//             res.status(400).json({
//               status: 'error',
//               error
//             })
//           ));
//       });
//   }
// }

// export default ReadingStatsController;
