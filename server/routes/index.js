const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authors Haven API is live'
  })
});

router.use('/api', require('./api'));

module.exports = router;
