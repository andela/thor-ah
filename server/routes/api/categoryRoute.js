import { Router } from 'express';
import CategoryController from '../../controllers/categoryController';
import auth from '../../middleware/auth';

const { authenticateUser, authorizeAuthor, authorizeAdmin } = auth;
const categoryRouter = Router();

categoryRouter.get('/', authenticateUser, authorizeAuthor, CategoryController.getAllCategories);
categoryRouter.post('/', authenticateUser, authorizeAdmin, CategoryController.createCategory);
categoryRouter.put('/:categoryId', authenticateUser, authorizeAdmin, CategoryController.editCategory);
categoryRouter.delete('/:categoryId', authenticateUser, authorizeAdmin, CategoryController.removeCategory);

export default categoryRouter;
