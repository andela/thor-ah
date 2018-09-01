import ArticleController from '../../controllers/article';

const router = require('express').Router();

router.post('/', ArticleController.create);
router.get('/', ArticleController.getAll);
router.get('/:article_slug', ArticleController.getSpecific);
router.put('/:article_slug', ArticleController.update);
router.delete('/:article_slug', ArticleController.delete);


export default router;
