var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/AlienLandings';
if(process.env.NODE_ENV === 'production'){

    dbURI = 'mongodb://heroku_1tj43hd1:rm3g444t7bel5rh7a2g3h8dqio@ds047355.mongolab.com:47355/heroku_1tj43hd1';
    //dbURI = process.env.MONGOLAB_URI : Could not get working, have to use hard-coded value for now;
}
mongoose.connect(dbURI);
mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
       console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//Nodemon restarts
process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});

//App termination
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

//For Heroku app termination
process.on('SIGTERM', function(){
    gracefulShutdown('Heroku app shutdown', function(){
        process.exit(0);
    });
});

require('./landings');