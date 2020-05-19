const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/Altamira';

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