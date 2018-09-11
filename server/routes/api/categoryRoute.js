import { Router } from 'express';
import CategoryController from '../../controllers/categoryController';
import auth from '../../middleware/auth';

const { authenticateUser, authorizeAuthor, authorizeAdmin } = auth;
const categoryRouter = Router();

// Users can get all articles
categoryRouter.get('/', authenticateUser, CategoryController.getAllCategories);
// Admin can create a new category
categoryRouter.post('/', authenticateUser, authorizeAdmin, CategoryController.createCategory);
// Admin can update a category
categoryRouter.put('/:categoryName', authenticateUser, authorizeAdmin, CategoryController.updateCategory);
// Admin can delete a category
categoryRouter.delete('/:categoryName', authenticateUser, authorizeAdmin, CategoryController.deleteCategory);
// Authors can add their article(s) to a category
categoryRouter.post('/:categoryName', authenticateUser, authorizeAuthor, CategoryController.addArticleToACategory);
// Users can get all articles for a category
categoryRouter.get('/:categoryName/articles', authenticateUser, CategoryController.getAllArticlesForACategory);
// Authors can remove their article(s) from a category
categoryRouter.delete('/:categoryName/articles', authenticateUser, authorizeAuthor, CategoryController.removeArticleFromACategory);
// Admin can add any article to any category
// categoryRouter.post('/:categoryName', authenticateUser, authorizeAdmin, CategoryController.addArticleToCategoryForAdmin);
// Admin can remove any article from a category
// categoryRouter.delete('/:articleTitle', authenticateUser, authorizeAdmin, CategoryController.deleteFromCategoryForAdmin);


export default categoryRouter;
