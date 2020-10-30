const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'please input a correct email'
        ]
    },
    role: {
        type: String,
        enum : ['user','publisher','admin'],
        default : 'user'
    },
    password: {
        type: String,
        required: [true, 'Please input password'],
        minlength: 6,
        select : false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
})



// encrypt password using bcrypt
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// sign jwt and return....geting a token 
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

//match user entered password to hashed password in database
 UserSchema.methods.matchPassword =  async function(enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
 }


module.exports = mongoose.model('User', UserSchema);