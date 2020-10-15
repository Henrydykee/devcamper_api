const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add name'],
        unique: true,
        trim: true,
        maxlength: [50, 'not more than  50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'please add description'],
        maxlength: [500, 'not more than  50 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*/,
            'please use a valid HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'phone number cannot be  more than  20 characters']
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'please input a correct email'
        ]
    },
    address: {
        type: String,
        requried: [true, 'please enter an address']
    },
    location: {
        //Geojson Point  
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageCost: Number,
    photo:{
        type: String,
        default: 'no_photo.jpg'
    },
    housing:{
        type:Boolean,
        default:  false
    },
    jobAssistance:{
        type:Boolean,
        default:  false
    },
    jobGuaratee:{
        type:Boolean,
        default:  false
    },
    acceptGi:{
        type:Boolean,
        default:  false
    },
    createdAt:{
        type:Date,
        default:  Date.now
    },
});

module.exports = mongoose.model('Bootcamp',BootcampSchema);