const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error')
//const { json } = require('express');
const logger = require('./middleware/logger');
const morgan  = require('morgan');
 const connectdb =  require('./config/db');

//load config file
dotenv.config({ path: './config/config.env' });


//connect to db
connectdb();
 

//Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');


const app = express();
//body parser
app.use(express.json());

app.use(logger);
//dve logger middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`sever running in ${process.env.NODE_ENV} mode on port ${PORT}`.green));

//handle unhandled rejection 

process.on('unhandled rejection',(err, Promise) => {
    console.log(`unhandled rejection: ${err.message}`.red);
    server.close(()=> {
        process.exit(1);
    })
})