import { Router } from 'express';
import ReadingStatsController from '../../controllers/readingStatsController';
import auth from '../../middleware/auth';

const { authenticateUser, authorizeAuthor, authorizeAdmin } = auth;

const readingStatsRoute = Router();

readingStatsRoute.get('/api/user-reading-stats');

