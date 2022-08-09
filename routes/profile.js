var express = require('express');
const joi = require('joi');
var router = express.Router();
var profileController= require('../controllers/profileController');
var {validateRequest,authenticateRequest} = require('../middlewares/api-utils');

router.get('/get/:uid', authenticateRequest(), validateRequest(), profileController.get_profile)

router.delete('/delete/:uid', authenticateRequest(), validateRequest() , profileController.get_profile)

router.post('/complete/:uid', authenticateRequest(), validateRequest({
    FirstName: joi.string().alphanum().min(3).max(64).required(),
    LastName: joi.string().alphanum().min(3).max(64).required(),
    Gender: joi.string().required(),
    BirthDate: joi.date().raw().required(),
    Aadhar: joi.string().regex(/[0-9]{12}/).required(),
    HomeAddress: joi.object().keys({
        area:joi.string(),
        city: joi.string(),
        state: joi.string(),
        pincode: joi.string(),
        geojson: joi.object()
    }).required()
}) , profileController.complete_profile)

router.post('/update/:uid', authenticateRequest(), validateRequest({
    FirstName: joi.string().alphanum().min(3).max(64).required(),
    LastName: joi.string().alphanum().min(3).max(64).required(),
    Gender: joi.string().required(),
    BirthDate: joi.date().raw().required(),
    Aadhar: joi.string().regex(/[0-9]{12}/).required(),
    HomeAddress: joi.object().keys({
        area:joi.string(),
        city: joi.string(),
        state: joi.string(),
        pincode: joi.string(),
        geojson: joi.object()
    }).required()
}) , profileController.update_profile)

router.put('/update-email/:uid', authenticateRequest(), validateRequest({
    Email: joi.string().email().required(),
    Password: joi.string().required().max(32)
}) , profileController.get_profile)

router.post('/add-email', authenticateRequest(), validateRequest({
    Email: joi.string().email().required(),
    Password: joi.string().required().max(32)
}) , profileController.get_profile)


router.post('/add-contact/:uid', authenticateRequest(), validateRequest({
    Name: joi.string().min(3).max(64).required(),
    Email: joi.string().email().required(),
    Contact: joi.string().regex(/[0-9]{10}/).required(),
    Relation: joi.string().alphanum().min(3).max(32),
    Age: joi.number()
}) , profileController.add_contact)



module.exports = router; 