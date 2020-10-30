const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/Bootcamp');

//@desc  get all courses 
//@route  GET /api/vi/bootcamps/:bootcampid/courses
//@access public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc  get single course 
//@route  GET /api/vi/course/:id
//@access public
exports.getCourse = asyncHandler(async (req, res, next) => {
    // res.status(200).json({ success: true, msg: "show single bootcamps" });
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!course) {
        return next(new ErrorResponse(`course not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({
        success: true,
        data: course
    });
});

//@desc  create new  course 
//@route  POST /api/vi/bootcamps/:bootcampId/courses
//@access private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    //setting the user in the course model to the request user id 
    req.body.user = req.user.id;

    //check if the bootcamp exist 
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }

    // make sure user is bootcamp owner 
    if (bootcamp.user !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized`, 401));
    }

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    });
});


//@desc   update course 
//@route  POST /api/vi/courses/:id
//@access private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // make sure user is bootcamp owner 
    if (course.user !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized`, 401));
    }

    courses = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: course
    })
});


//@desc  Delete course
//@route  Delete /api/vi/course/:id
//@access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Bootcamp.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // make sure user is bootcamp owner 
    if (course.user !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized`, 401));
    }
    await course.remove();

    res.status(200).json({
        success: true,
        data: {}

    });

});