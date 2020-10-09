
//@desc  get all bootcamps 
//@route  GET /api/vi/bootcamps
//@access public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "show all bootcamps" });
}

//@desc  get single bootcamps 
//@route  GET /api/vi/bootcamps/:id
//@access public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "show single bootcamps" });
}

//@desc  create new  bootcamps 
//@route  POST /api/vi/bootcamp s
//@access private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "create bootcamps" });
}


//@desc  Update bootcamps
//@route  PUT /api/vi/bootcamps/:id
//@access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "update bootcamps" });
}

//@desc  Delete bootcamps
//@route  Delete /api/vi/bootcamps/:id
//@access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "delete bootcamps" });
}