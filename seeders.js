const fs = require('fs');
const moongose = require ('mongoose');
const color = require('colors');
const dotenv = require('dotenv');

// load env variables
dotenv.config({path: './config/config.env'});

// load models
const Bootcamps = require('./models/Bootcamp')

// connect to db
moongose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
 

// read json files
const  bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')); 

//import data into database
const importData = async() =>{
    try {
        await Bootcamps.create(bootcamps);
        console.log('Data imported..'.green.inverse)
    } catch (error) {
        console.error(`${error}`)
    }
}

//delete data
const deleteData = async() =>{
    try {
        await Bootcamps.deleteMany();
        console.log('Data destroyed..'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`)
    }
}

if(process.argv[2] ==='-i'){
    importData();
}else if (process.argv[2] === '-d'){
    deleteData();
}