import { Router } from 'express';
import ReadingStatsController from '../../controllers/readingStatsController';
import auth from '../../middleware/auth';

const { authenticateUser, authorizeAuthor, authorizeAdmin } = auth;

const readingStatsRouter = Router();

readingStatsRouter.get('/', authenticateUser, ReadingStatsController.getAllReadingStats);

export default readingStatsRouter;
