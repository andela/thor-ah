import ArticleController from '../../controllers/article';
import CommentsController from '../../controllers/comments';
import LikeDislike from '../../controllers/likeDislike';
import auth from '../../middleware/auth';

// get authenticateUser method
const { authenticateUser, authorizeAuthor } = auth;
const router = require('express').Router();

router.get('/search', ArticleController.search);
router.post('/', authenticateUser, authorizeAuthor, ArticleController.create);
router.post('/:article_slug/comments', authenticateUser, CommentsController.createComment);
router.post('/:article_slug/comments/:commentId', authenticateUser, CommentsController.createCommentReply);
router.get('/:article_slug/comments/:commentId', authenticateUser, CommentsController.getCommentById);
router.post('/:article_slug/comments/:commentId/:reaction', authenticateUser, CommentsController.likeOrDislikeComment);
router.get('/:article_slug/comments/:commentId/reaction_status', authenticateUser, CommentsController.checkReactionStatus);
router.get('/', authenticateUser, ArticleController.getAll);
router.get('/:articleId/reactions', authenticateUser, LikeDislike.getLikesDislikes);
router.get('/:articleId/reactions/status', authenticateUser, LikeDislike.getReactionStatus);
router.get('/:article_slug', authenticateUser, ArticleController.getSpecific);
router.put('/:article_slug', authenticateUser, ArticleController.update);
router.delete('/:article_slug', authenticateUser, ArticleController.delete);
router.post('/tags', authenticateUser, authorizeAuthor, ArticleController.createTags);
router.post('/:articleId/reactions', authenticateUser, LikeDislike.likeOrDislike);

export default router;
