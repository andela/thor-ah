import { Router } from 'express';
import auth from '../../middleware/auth';
import authorRequestsController from '../../controllers/authorRequests';
import HandleReports from '../../controllers/adminHandleReports';

const { authenticateUser, authorizeAdmin } = auth;
const adminRoutes = Router();

adminRoutes.get('/articles/reports', authenticateUser, authorizeAdmin, HandleReports.getReportedArticles);
adminRoutes.get('/articles/reports/:reportId', authenticateUser, authorizeAdmin, HandleReports.getAReportedArticle);
adminRoutes.get('/reports/articles/:article_slug', authenticateUser, authorizeAdmin, HandleReports.getReportsForAnArticle);
adminRoutes.put('/articles/:article_slug/delist', authenticateUser, authorizeAdmin, HandleReports.delistArticle);
adminRoutes.get('/articles/delisted', authenticateUser, authorizeAdmin, HandleReports.getDelistedArticles);
adminRoutes.get('/articles/:article_slug/delisted', authenticateUser, authorizeAdmin, HandleReports.getADelistedArticle);
adminRoutes.put('/articles/:article_slug/relist', authenticateUser, authorizeAdmin, HandleReports.relistArticle);
adminRoutes.put('/authors/requests/:requestId/accept', authenticateUser, authorizeAdmin, authorRequestsController.acceptRequest);
adminRoutes.put('/authors/requests/:requestId/reject', authenticateUser, authorizeAdmin, authorRequestsController.rejectRequest);
adminRoutes.get('/authors/requests/:requestId', authenticateUser, authorizeAdmin, authorRequestsController.getRequest);
adminRoutes.get('/authors/requests/users/:userId', authenticateUser, authorizeAdmin, authorRequestsController.getRequests);

export default adminRoutes;
