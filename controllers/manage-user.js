var express = require('express');
var router = express.Router();
var mongoose = require('../config/dbconnection');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');




module.exports = {
  createUser: createUser,
  createRole: createRole,
  login: login,
  createVehicle: createVehicle,
  getAllCreateVehicle: getAllCreateVehicle,
  getUserCatogory: getUserCatogory,
  getRoleById: getRoleById,
  getListUserByCatogory: getListUserByCatogory
}

  function createUser(req, res, next) {
    console.log(req.body)
    if(req.body.userRole){
      console.log(req.body.userRole);
      UserRole =  User.UserRole;
      UserRole.findOne({
        _id: req.body.userRole
      }).exec(function(err, role) {
        if(err) {
          console.log(error);
          return next(err);
        }
        if(role.role_name == 'superadmin' || role.role_name == 'admin' ) {
          console.log(role);
          console.log(role._id);
          UserRole.findOne({
            role_name: req.body.roles
          }).exec(function(err,creUserRole){
            if(err) {
              console.log(error);
              return next(err);
            }
            if(creUserRole.role_name == role.role_name){
              console.log(creUserRole._id);
              console.log(role._id);
                return res.status(401)
                  .json({message: "admin not authorized to add admin user"});
                console.log("this can not do")
            } else {
                bcrypt.hash(req.body.password, null, null, function(err, hashPassword) {
                  if(err) return next(err);
                  user = new User.User({
                    userId: req.body.userId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    roles: creUserRole._id,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashPassword,
                    vehicle:req.body.vehicle
                  });
                  user.save().then(userDoc =>{
                    return res.status(200)
                      .json({message: "Registered successfully!"});
                  },
                    error =>{
                      console.log(error);
                      return next(error);
                    });
                });
            }
          });

        } else{
          return res.status(401)
            .json({message: "not authorized"});
          console.log("not authorized");
        }
      });
    }
  }

  function login(req, res, next) {
    req.checkBody({
      'userId': {
        notEmpty: true,
        errorMessage: 'userId is required',
      },
      'password': {
        notEmpty: true,
        errorMessage: 'password is required'
      }
    });
    req.getValidationResult().then(function(result){
      if(!result.isEmpty()){
        return res.status(422)
          .json({
            data: result.array(),
            message: "validation failed"
          });
      }else {
        user = User.User;
        query = user.findOne({userId: req.body.userId});
        query.exec(function(err, userDoc) {
          if(err) {
            console.log(err);
            return next(err);
          }
          if(userDoc) {
            bcrypt.compare(req.body.password, userDoc.password, function(err, response) {
              if (err) {
                return res.status(401)
                  .json({
                    status: 'exception',
                    message: 'Authentication failed. Wrong password.'
                  });
              }else{
                console.log("yes");
                return res.status(200)
                  .json({
                    status: 'yes',
                    message: 'logIn successfully',
                    data: userDoc
                  });
              }
            });
          }else {
            return res.status(404)
              .json({"message": "user not found"});
          }
        });
      }
    });
  }

  function createVehicle(req, res, next) {
    userVehicle = new User.UserVehicle(req.body);
    userVehicle.save().then(role => {
      return res.status(200)
        .json({message: "vehicle created"});
    },
      error => {
        return next(error);
      })

  }

  function getAllCreateVehicle(req, res, next) {
    userVehicle = User.UserVehicle;
    userVehicle.find().exec(function(err, users) {
      console.log(users);
      if(err) {
        console.log(err);
        return next(err);
      }
      if(users) {
        return res.status(200)
          .json(users);
      }else {
        return res.status(404)
          .json({message: "There is no userVehicle"});
      }
    });
  }

  function getUserCatogory(req, res, next){
    if(req.params.id){
        user = User.User;
        user.findOne({
          _id: req.params.id
        }).exec(function(err, role) {
          if(err){
            console.log(err);
            return next(err);
          }
          if(role) {
            return res.status(200)
              .json({data: role});
          }
        });
    }
  }

  function createRole(req,res,next) {
    userRole =  new User.UserRole(req.body);

    userRole.save().then(role =>{
      return res.status(200)
        .json({message: "role created"});
    },
      error => {
        console.log(error);
        return next(error);
      });
  }

 function getRoleById(req, res, next) {

    if(req.params.id){
        userRole = User.UserRole;
        userRole.findOne({
          _id: req.params.id
        }).exec(function(err, role) {
          if(err){
            console.log(err);
            return next(err);
          }
          if(role) {
            return res.status(200)
              .json({data: role});
          }
        });
    }
 }

 function getListUserByCatogory(req, res, next){
   console.log(req.params.id);
   if( req.params.id) {
     console.log(req.params.id);
     userRole = User.UserRole;
     userRole.findOne({
       _id: req.params.id
     }).exec(function(err, role) {
       if(err) {
         console.log(error);
         return next(err);
       }
       if(role.role_name == 'superadmin') {
         user = User.User;
         user.find().exec(function(err, users) {
           console.log(users);
           if(err) {
             console.log(err);
             return next(err);
           }
           if(users) {
             return res.status(200)
               .json(users);
           }else {
             return res.status(404)
               .json({message: "There is no any user"});
           }
         });
       }
       if(role.role_name == 'admin') {
         user = User.User;
         userRole = User.UserRole;
         userRole.findOne({role_name: 'user'}).exec(function(err, user) {
           console.log("hello")
           console.log(user);
           if(err) {
             console.log(err);
             return next(err);
           }
           if(user) {
             userDoc = User.User;
             userDoc.find({$or:[{roles: user._id}]}).exec(function(err, users) {
               console.log(users);
               if(err) {
                 console.log(err);
                 return next(err);
               }
               if(users) {
                 return res.status(200)
                   .json(users);
               }else {
                 return res.status(404)
                   .json({message: "There is no any user"});
               }
             });
           }else {
               return res.status(404)
                 .json({message: "There is no any user Role"});
             }
         });

       }
       if(role.role_name == 'user') {

       } else {

       }
     });
   }
 }
