const mongoose = require('mongoose');
require('dotenv').config()

const mongoDB = process.env.MONGO_URL_CONNECT;

mongoose.connect(mongoDB, { 
    useCreateIndex: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', function(error){
    console.log(error)
});

db.on('open', function(){
    console.log('Mongo Connected')
})

module.exports = mongoose;