import { Router } from 'express';
import favoriteArticleController from '../../controllers/favoriteArticle';
import auth from '../../middleware/auth';

const router = Router();

// methods that authenticates the user
const { authenticateUser } = auth;

// route for favoriting an article
router.post(
  '/article/:articleId/favorite', authenticateUser, favoriteArticleController.create
);

// route for removing a favorited article
router.delete(
  '/article/:articleId/favorite', authenticateUser, favoriteArticleController.remove
);

// route for getting all the user's favorite articles
router.get(
  '/user/articles/favorite', authenticateUser, favoriteArticleController.list
);

export default router;
