const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({

    user : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required : true
    },
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
        maxlength: [500, 'not more than  500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
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
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
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
        default: 'no_photo'
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

},{
    toJSON :{virtuals: true},
    toObject: {virtuals : true}
});

// create bootcamp slug from name 
BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next();
});
//GEOCODE $ CREATE LOCATION FIELD
BootcampSchema.pre('save', async function(next){
    const loc =  await geocoder.geocode(this.address);
    this.location = {
        type: 'point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }
    next();
});

//cascade delete courses when bootcamp is deleted 
BootcampSchema.pre('remove', async function (next){
    await this.model('Course').deleteMany({bootcamp: this._id});
    next()
});

// reverse populate with virtuals 
BootcampSchema.virtual('courses',{
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})


module.exports = mongoose.model('Bootcamp',BootcampSchema);