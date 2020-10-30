const { Router } = require("express");
const express = require("express");
const { protect , authorize } = require('../middleware/auth')


const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

// include other resources routers

const courseRouter = require('./courses');

const router = express.Router();

//re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

const bootcamp = require('../models/Bootcamp');
const advancedResult = require('../middleware/advancedResults');
const Bootcamp = require("../models/Bootcamp");


//route
router.route('/:id/photo').put(protect,authorize('publisher','admin') ,bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/').get(advancedResult(Bootcamp, 'courses'), getBootcamps).post(protect,authorize('publisher','admin'), createBootcamp);

router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'), updateBootcamp).delete(protect,authorize('publisher','admin'), deleteBootcamp);

module.exports = router; 