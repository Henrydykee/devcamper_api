const { Router } = require("express");
const express = require("express");

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse
} = require('../controllers/courses')

const router = express.Router({
    mergeParams : true
});

router.route('/').get(getCourses);
router.route('/:id').post(createCourse);
router.route('/:id').get(getCourse);
router.route('/:id').put(updateCourse);

module.exports = router; 