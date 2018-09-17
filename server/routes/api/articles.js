import { Router } from 'express';
import ArticleController from '../../controllers/article';
import CommentsController from '../../controllers/comments';
import LikeDislike from '../../controllers/likeDislike';
import auth from '../../middleware/auth';
import ReadingStatsController from '../../controllers/readingStatsController';

// get authenticateUser method
const { authenticateUser, authorizeAuthor } = auth;
const router = Router();

router.get('/search', ArticleController.search);
router.post('/', authenticateUser, authorizeAuthor, ArticleController.create);
router.post('/:article_slug/comments', authenticateUser, CommentsController.createComment);
router.post('/:article_slug/comments/:commentId', authenticateUser, CommentsController.createCommentReply);
router.get('/:article_slug/comments/:commentId', authenticateUser, CommentsController.getCommentById);
router.get('/:article_slug/comments/:commentId/edits', authenticateUser, CommentsController.getCommentEdits);
router.post('/:article_slug/comments/:commentId/:reaction', authenticateUser, CommentsController.likeOrDislikeComment);
router.get('/:article_slug/comments/:commentId/reaction_status', authenticateUser, CommentsController.checkReactionStatus);
router.get('/:article_slug/comments', authenticateUser, CommentsController.getArticleComments);
router.put('/:article_slug/comments/:commentId', authenticateUser, CommentsController.updateComment);
router.get('/', authenticateUser, ArticleController.getAll);
router.get('/', authenticateUser, ArticleController.getAllArticles);
router.get('/:articleId/reactions', authenticateUser, LikeDislike.getLikesDislikes);
router.get('/:articleId/reactions/status', authenticateUser, LikeDislike.getReactionStatus);
router.get('/:article_slug', authenticateUser, ArticleController.getArticle, ReadingStatsController.postArticleViewHistory);
router.put('/:article_slug', authenticateUser, ArticleController.update);
router.delete('/:article_slug', authenticateUser, ArticleController.delete);
router.post('/tags', authenticateUser, authorizeAuthor, ArticleController.createTags);
router.post('/:articleId/reactions', authenticateUser, LikeDislike.likeOrDislike);
router.post('/:article_slug/report', authenticateUser, ArticleController.reportOnArticle);

export default router;
