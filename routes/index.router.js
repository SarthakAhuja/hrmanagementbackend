const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/saveUser', ctrlUser.signup);
router.post('/savePassword', ctrlUser.savePassword);
router.post('/checkin',jwtHelper.verifyJwtToken, ctrlUser.attendance);
router.post('/checkout',jwtHelper.verifyJwtToken, ctrlUser.checkout);
router.get('/attendance',jwtHelper.verifyJwtToken, ctrlUser.getAttendance);
router.get('/lastweek',jwtHelper.verifyJwtToken, ctrlUser.lastWeekAttendance);
router.get('/getEmployees',jwtHelper.verifyJwtToken, ctrlUser.employeeDetails);
router.post('/addLeave',jwtHelper.verifyJwtToken, ctrlUser.leave);
router.get('/getLeave',jwtHelper.verifyJwtToken, ctrlUser.getLeave);
router.get('/getAllLeave',jwtHelper.verifyJwtToken, ctrlUser.getAllLeave);


module.exports = router;



