const express = require('express');
const dotenv = require('dotenv');
//const { json } = require('express');
const logger = require('./middleware/logger');
const morgan  = require('morgan')

//load config file

dotenv.config({ path: './config/config.env' });

//Routes files
const bootcamps = require('./routes/bootcamps');

const app = express();

app.use(logger);
//dve logger middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`sever running in ${process.env.NODE_ENV} mode on port ${PORT}`));