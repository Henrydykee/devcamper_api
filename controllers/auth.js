const crypto = require('crypto');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const { options, use } = require('../routes/auth');

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

//@desc  get loggeding  user 
//@route  get /api/vi/auth/me
//@access private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
});

//@desc  get log user out / clear cookies 
//@route  get /api/vi/auth/logout
//@access private

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token','none',{
        expires : new Date(Date.now() + 10 * 1000),
        httpOnly:  true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
});


//@desc  forgot password  
//@route  get /api/vi/auth/forgotpassword
//@access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`invalid credentials`, 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false})

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `you are recieving this email because you requested a resetpassword, please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email : user.email,
            subject: 'password reset token',
            message: message
        })
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined;
       user.resetPasswordRExpire = undefined;
        await use.save({validateBeforeSave : false})
        return next(new ErrorResponse(`Email could not be sent `, 500));
        
    }
});

 

//@desc  PUT resetpassword
//@route  PUT /api/vi/auth/resetpassword/:resetToken
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //get hased token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
       resetPasswordToken,
       resetPasswordRExpire: {$gt : Date.now()}
    })

    if(!user){
        return next(new ErrorResponse(`invalid token`, 400));
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordRExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res)
});


//@desc  update user  details 
//@route  get /api/vi/auth/updateetails
//@access private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name:req.body.name , 
        email: req.body.email,  
    }
    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        runValidators : true,
        new : true
    })
    res.status(200).json({
        success: true,
        data: user
    })
});

//@desc  update password
//@route  PUT /api/vi/auth/updatepassword
//@access private

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`password is incorrect`, 401));
    }

    user.password =req.body.newPassword

    await user.save()
    res.status(200).json({
        success: true,
        data: user
    })
});


//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token 
    const token = user.getSignedJwtToken();

    const option = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'PRODUCTION') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, option).json({
        success: true,
        token,
        data: user
    })
}

