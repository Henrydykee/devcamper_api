const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { options } = require('../routes/auth');

//@desc  create new  user 
//@route  POST /api/vi/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //CREATE TOKEN
    // const token = user.getSignedJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token,
    //     data: user
    // });

      sendTokenResponse(user, 200, res);
});


//@desc  create new  user 
//@route  POST /api/vi/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    //validate email and password
    if (!email || !password) {

        return next(new ErrorResponse(`please provide an email and password`, 404));
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse(`invalid credentials`, 401));
    }

    //check if password matches

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(`invalid credentials`, 401));
    }

    //CREATE TOKEN
    // const token = user.getSignedJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token,
    //     data: user
    // });

    sendTokenResponse(user, 200, res)
});

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token 
    const token = user.getSignedJwtToken();

    const option = {
        expires: new Date(Date.now () + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    
    if(process.env.NODE_ENV === 'PRODUCTION'){
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, option).json({
        success: true,
        token,
        data: user
    })
}