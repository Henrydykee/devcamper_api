const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectdb =  require('./config/db');
const helmet = require("helmet");
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');

//load config file
dotenv.config({ path: './config/config.env' });


//connect to db
connectdb();


 

//Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
//const { use } = require('./routes/auth');



const app = express();
//body parser
app.use(express.json());

app.use(cookieParser());

//sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

app.use(xss());

app.use(hpp());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

app.use(logger);

//  apply to all requests
app.use(limiter);


//dev logger middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);

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