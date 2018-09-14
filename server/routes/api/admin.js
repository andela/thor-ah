import auth from '../../middleware/auth';
import HandleReports from '../../controllers/adminHandleReports';

// get authenticateUser method
const { authenticateUser, authorizeAdmin } = auth;
const adminRoutes = require('express').Router();


adminRoutes.get('/articles/reports', authenticateUser, authorizeAdmin, HandleReports.getReportedArticles);
adminRoutes.get('/articles/reports/:reportId', authenticateUser, authorizeAdmin, HandleReports.getAReportedArticle);
adminRoutes.get('/reports/articles/:article_slug', authenticateUser, authorizeAdmin, HandleReports.getReportsForAnArticle);
adminRoutes.put('/articles/:article_slug/delist', authenticateUser, authorizeAdmin, HandleReports.delistArticle);
adminRoutes.get('/articles/delisted', authenticateUser, authorizeAdmin, HandleReports.getDelistedArticles);
adminRoutes.get('/articles/:article_slug/delisted', authenticateUser, authorizeAdmin, HandleReports.getADelistedArticle);
adminRoutes.put('/articles/:article_slug/relist', authenticateUser, authorizeAdmin, HandleReports.relistArticle);

export default adminRoutes;
