const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async'); 

//@desc  get all bootcamps 
//@route  GET /api/vi/bootcamps
//@access public
exports.getBootcamps = asyncHandler( async (req, res, next) =>  {
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr)); 

    const bootcamps = await query;

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
        });
});



//@desc  get single bootcamps 
//@route  GET /api/vi/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler( async (req, res, next) => {
   // res.status(200).json({ success: true, msg: "show single bootcamps" });
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
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
   
        const bootcamp =  await  Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
});


//@desc  Update bootcamps
//@route  PUT /api/vi/bootcamps/:id
//@access private
exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        });
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
         }
        res.status(200).json({success: true, data: bootcamp})
});

//@desc  Delete bootcamps
//@route  Delete /api/vi/bootcamps/:id
//@access private
exports.deleteBootcamp =  asyncHandler( async (req, res, next) => {
   
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
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
exports.getBootcampInRadius  =  asyncHandler( async (req, res, next) => {
    const{zipcode, distance, } = req.params
    const loc = await geocoder.gerocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculate the radius 
    // divide distance by radius of earth
    // earth radius = 3,963 mi/ 6,378km 
    const radius = distance / 3963;

    const bootcamps = await bootcamps.find({
        location:  {$geoWithin : {$centerSphere: [[lng, lat], radius ]}}
    });


    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});

