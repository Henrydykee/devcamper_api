const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

//@desc  get all bootcamps 
//@route  GET /api/vi/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = req.query;


    //fields to exclude
    const removeFileds = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFileds.forEach(param => delete reqQuery[param]);

    // creat query string 
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // select fields 
    if (req.query.select) {
        const fields = req.query.select.split(',').join('');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    };

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const statIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();



    query = query.skip(statIndex).limit(limit);
    //pagination result 
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (statIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // executing query 
    const bootcamps = await query;
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps,
    });
});



//@desc  get single bootcamps 
//@route  GET /api/vi/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    // res.status(200).json({ success: true, msg: "show single bootcamps" });
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});



//@desc  create new  bootcamps 
//@route  POST /api/vi/bootcamps
//@access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});


//@desc  Update bootcamps
//@route  PUT /api/vi/bootcamps/:id
//@access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp })
});

//@desc  Delete bootcamps
//@route  Delete /api/vi/bootcamps/:id
//@access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });

});

//@desc  get bootcamps within a radius 
//@route  get /api/vi/bootcamps/radius/:zipcode/:distance
//@access private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance, } = req.params
    const loc = await geocoder.gerocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculate the radius 
    // divide distance by radius of earth
    // earth radius = 3,963 mi/ 6,378km 
    const radius = distance / 3963;

    const bootcamps = await bootcamps.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });


    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});



//@desc  upload photo
//@route  PUT /api/vi/bootcamps/:id/photo
//@access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    if (!req.files) {
        return next(new ErrorResponse(`please upload a file`, 404));
    }
    const file = req.files.file
    console.log(file)
    //make sure file is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`please upload an image file`, 400));
    }

    //check image size 
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`file too large ${process.env.MAX_FILE_UPLOAD}`, 404));
    }

    // CREATE CUSTOM FILE NAME 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`problem with file upload`, 400));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    });
    res.status(200).json({
        success: true,
        data: file.name
    })
});