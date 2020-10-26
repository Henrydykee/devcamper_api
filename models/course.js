const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim : true,
        required : [true, 'Please add a course title'],
        maxlength: [50, 'not more than  50 characters']
    },

    description: {
        type: String,
        trim : true,
        required : [true, 'Please add a course title'],
        maxlength: [500, 'not more than 500 characters' ]
    },

    weeks : {
        type : String,
        required: [true, 'please enter a duration']
    },

    tuition : {
        type : String,
        required: [true, 'please enter tution amount  ']
    },

    minimumSkill  : {
        type : String,
        required : [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },

    scholarhipsAvailable:{
        type:Boolean,
        default:  false
    },
    createdAt:{
        type:Date,
        default:  Date.now
    },

    bootcamp : {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required : true
    }
});

module.exports = mongoose.model('Course', CourseSchema);