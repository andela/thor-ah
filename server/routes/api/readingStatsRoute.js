import { Router } from 'express';
import ReadingStatsController from '../../controllers/readingStatsController';
import auth from '../../middleware/auth';

const { authenticateUser } = auth;

const readingStatsRouter = Router();

readingStatsRouter.get('/', authenticateUser, ReadingStatsController.getAllReadingStats);

export default readingStatsRouter;
