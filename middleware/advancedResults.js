const { model, populate } = require("../models/course");

const advancedResults = (model, populate) => async(req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = req.query;


    //fields to exclude
    const removeFileds = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFileds.forEach(param => delete reqQuery[param]);

    // creat query string 
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // finding resource
    query = model.find(JSON.parse(queryStr));

    // select fields 
    if (req.query.select) {
        const fields = req.query.select.split(',').join('');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    };

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const statIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(statIndex).limit(limit);

    if (populate){
        query = query.populate(populate);
    }

    //executing query
    const results = await query;

    //pagination result 
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (statIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination ,
        data: results
    }

    next();
};

module.exports = advancedResults; 