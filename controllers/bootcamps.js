const Bootcamp = require('../models/Bootcamp');

//@desc  get all bootcamps 
//@route  GET /api/vi/bootcamps
//@access public
exports.getBootcamps = async (req, res, next) =>  {
    try{
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
         
        })
    }catch(e){
        res.status(400).json({
            success:false
        })
    }

}

//@desc  get single bootcamps 
//@route  GET /api/vi/bootcamps/:id
//@access public
exports.getBootcamp = async (req, res, next) => {
   // res.status(200).json({ success: true, msg: "show single bootcamps" });
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return  res.status(400).json({success: false})
        }
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    }catch(e){
        console.log(`${e}`);
        res.status(400).json({
            success:false
        })
    }
}

//@desc  create new  bootcamps 
//@route  POST /api/vi/bootcamps
//@access private
exports.createBootcamp =  async (req, res, next) => {
    try{
        const bootcamp =  await  Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch(e){
        console.log(`${e}`.red);
        res.status(400).json({
            success: false,
            data: 'bootcamp already exist'
        })
    }

}


//@desc  Update bootcamps
//@route  PUT /api/vi/bootcamps/:id
//@access private
exports.updateBootcamp = async (req, res, next) => {
    try{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        });
        if(!bootcamp){
            return  res.status(400).json({success: false})
         }
        res.status(200).json({success: true, data: bootcamp})
    }catch(e){
        console.log(`${e}`.red);
        res.status(400).json({
            success:false
        })
    }

}

//@desc  Delete bootcamps
//@route  Delete /api/vi/bootcamps/:id
//@access private
exports.deleteBootcamp =  async (req, res, next) => {
    try{
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
        return  res.status(400).json({success: false})
     }
     res.status(200).json({
         success: true,
         data: bootcamp
     })
    }catch(e){
        console.log(`${e}`);
        res.status(400).json({
            success:false
        })
    }

}