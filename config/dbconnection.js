var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/demoAdminserver',function(error){
  if(error){
    console.log(error);
  }
});

module.exports = mongoose;
