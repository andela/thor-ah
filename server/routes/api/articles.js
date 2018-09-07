import ArticleController from '../../controllers/article';
import CommentsController from '../../controllers/comments';
import auth from '../../middleware/auth';

// get authenticateUser method
const { authenticateUser, authorizeAuthor } = auth;
const router = require('express').Router();


router.post('/', authenticateUser, authorizeAuthor, ArticleController.create);
router.post('/:article_slug/comments', authenticateUser, CommentsController.createComment);
router.get('/', authenticateUser, ArticleController.getAll);
router.get('/:article_slug', authenticateUser, ArticleController.getSpecific);
router.put('/:article_slug', authenticateUser, ArticleController.update);
router.delete('/:article_slug', authenticateUser, ArticleController.delete);
router.post('/tags', authenticateUser, authorizeAuthor, ArticleController.createTags);

export default router;
