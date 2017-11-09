var express = require('express');
var router = express.Router();

var manageUser = require('../controllers/manage-user');


router.post('/addUser', manageUser.createUser);
router.post('/addRole', manageUser.createRole);
router.post('/login', manageUser.login);
router.post('/createVehicle', manageUser.createVehicle);
router.get('/getAllCreateVehicle', manageUser.getAllCreateVehicle);
router.get('/getUserCatogory/:id',manageUser.getUserCatogory);
router.get('/getRoleById/:id',manageUser.getRoleById);
router.get('/getListUserByCatogory/:id', manageUser.getListUserByCatogory)

module.exports = router;
