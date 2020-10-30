const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required : true
    },
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

// CourseSchema.static.getAverageCost = async function (bootcampId){
//     const obj = await this.aggregate([
//         {
//             $match: {bootcamp: bootcampId}
//         },
//         {
//             $group:{
//                 _id:'$bootcamp',
//                 averageCost : {$avg: '$tuition'}
//             }
//         }

//     ]);
//     try {
//         await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
//             averageCost : Math.ceil(obj[0].averageCost / 110) *10
//         })
//     } catch (error) {
//         console.error(error)
//     }
// }
// // call getaverage cost after save
// CourseSchema.post('save',function(){
//     this.constructor.getAverageCost(this.bootcamp)
// });
// // // call getaverage cost before save
// // CourseSchema.post('save',function(){
//     this.constructor.getAverageCost(this.bootcamp)
// });

module.exports = mongoose.model('Course', CourseSchema);