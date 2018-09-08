import { Router } from 'express';
import CategoryController from '../../controllers/categoryController';
import auth from '../../middleware/auth';

const { authenticateUser, authorizeAuthor, authorizeAdmin } = auth;
const categoryRouter = Router();

categoryRouter.get('/', authenticateUser, CategoryController.getAllCategories);
categoryRouter.post('/', authenticateUser, authorizeAdmin, CategoryController.createCategory);
categoryRouter.put('/:categoryName', authenticateUser, authorizeAdmin, CategoryController.updateCategory);
categoryRouter.delete('/:categoryName', authenticateUser, authorizeAdmin, CategoryController.deleteCategory);

export default categoryRouter;
