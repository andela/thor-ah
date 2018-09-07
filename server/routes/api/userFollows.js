import userFollow from '../../controllers/userFollows';
import auth from '../../middleware/auth';

const { authenticateUser } = auth;
const router = require('express').Router();

router.post('/', authenticateUser, userFollow.follow);
router.get('/followers/', authenticateUser, userFollow.getFollowers);
router.get('/followings/', authenticateUser, userFollow.getFollowings);
router.delete('/', authenticateUser, userFollow.unfollow);

export default router;
