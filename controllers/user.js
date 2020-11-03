const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { options, use } = require('../routes/auth');
const { find } = require('../models/user');


//@desc  get all users
//@route  get /api/vi/auth/users
//@access private/admin
exports.getAllUser = asyncHandler(async (req, res, next) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        count: User.length,
        data : user
    });
});

//@desc  getsingle user 
//@route  get /api/vi/auth/users/:id
//@access private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: user
    })
});


//@desc  Create user 
//@route  get /api/vi/auth/users/createuser
//@access private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    })
});

//@desc  Update user 
//@route  put /api/vi/auth/users/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: user
    })
});

//@desc  delete user 
//@route  delete /api/vi/auth/users/:id
//@access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        data: user
    })
});