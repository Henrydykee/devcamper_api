const { Router } = require("express");
const express = require("express");
const {protect,authorize} = require('../middleware/auth')

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse
} = require('../controllers/courses');

const Course = require('../models/course');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router({
    mergeParams : true
});

router.route('/').get(advancedResults(Course,{path:'bootcamp' , select:'name description'}),getCourses);
router.route('/:id').post(protect,authorize('publisher','admin'),createCourse);
router.route('/:id').get(protect,getCourse);
router.route('/:id').put(protect,authorize('publisher','admin'),updateCourse);

module.exports = router; 