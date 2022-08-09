
var express = require('express');
const joi = require('joi');
var router = express.Router();
var authController= require('../controllers/authController');
var {validateRequest,authenticateRequest} = require('../middlewares/api-utils');

//new signup including only email and password, separate endpoint for completing profile
router.post('/simple-signup', authenticateRequest({isPublic:true}), validateRequest({
  CountryCode: joi.string().max(4),
  Contact: joi.string().regex(/[0-9]{10}/),
  Password: joi.string().required().min(8).max(64),
  ConfirmPassword: joi.string().required().min(8).max(64)
}) , authController.new_signup)

// new login using email and password, return bearer token
router.post('/login', authenticateRequest({isPublic:true}), validateRequest({
  CountryCode: joi.string().max(4),
  Contact: joi.string().regex(/[0-9]{10}/),
  Password: joi.string().required().max(32),
  Platform: joi.string().required()
}) , authController.new_login)

router.get('/logout', authenticateRequest() , authController.logout)

router.post('/change-password/:uid', authenticateRequest(), validateRequest({
  // Email: joi.string().email().required(),
  // Password: joi.string().required().max(32)
}) , authController.new_login)

module.exports = router;