var mongoose = require('../config/dbconnection');
var Schema = mongoose.Schema;

var userSchema = Schema({
  userId: {type: String, unique: true},
  firstName: String,
  lastName: String,
  roles: { type: Schema.Types.ObjectId, ref: 'UserRole' },
  email: {type: String, unique: true},
  phone: String,
  vehicle:[{ type: String, ref: 'vehicleSchema' }],
  password: String
});

var vehicleSchema = Schema({
    vehicle_Name: String
});

var userRoleSchema = Schema({

  role_name:String,
  actions:[String]
});

var User = mongoose.model('User', userSchema);
var UserRole = mongoose.model('UserRole', userRoleSchema);
var UserVehicle = mongoose.model('UserVehicle', vehicleSchema);

module.exports = {
  User: User,
  UserRole: UserRole,
  UserVehicle:UserVehicle
}
