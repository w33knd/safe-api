
var express = require('express');
var router = express.Router();
var updateController= require('../controllers/updateController');

// Home page route.
router.post('/location', updateController.update_location)

// About page route.
router.get('/about', function (req, res) {
  res.send('About this wiki');
})

module.exports = router;