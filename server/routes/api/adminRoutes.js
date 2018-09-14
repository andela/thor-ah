import auth from '../../middleware/auth';
import AdminRolesController from '../../controllers/adminHandleReports';

// get authenticateUser method
const { authenticateUser, authorizeAdmin } = auth;
const adminRoutes = require('express').Router();


adminRoutes.get('/articles/reports', authenticateUser, authorizeAdmin, AdminRolesController.getAllReports);
adminRoutes.get('/articles/reports/:reportId', authenticateUser, authorizeAdmin, AdminRolesController.getSingleReport);
adminRoutes.get('/reports/articles/:article_slug', authenticateUser, authorizeAdmin, AdminRolesController.getReportsForSingleArticle);
adminRoutes.put('/articles/:article_slug/block', authenticateUser, authorizeAdmin, AdminRolesController.blockArticle);
adminRoutes.get('/articles/blocked', authenticateUser, authorizeAdmin, AdminRolesController.getBlockedArticles);
adminRoutes.get('/articles/:article_slug/blocked', authenticateUser, authorizeAdmin, AdminRolesController.getABlockedArticle);
adminRoutes.put('/articles/:article_slug/unblock', authenticateUser, authorizeAdmin, AdminRolesController.unblockArticle);

export default adminRoutes;
