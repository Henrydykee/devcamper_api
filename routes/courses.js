const { Router } = require("express");
const express = require("express");

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
router.route('/:id').post(createCourse);
router.route('/:id').get(getCourse);
router.route('/:id').put(updateCourse);

module.exports = router; 