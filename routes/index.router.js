const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/saveUser', ctrlUser.signup);
// router.post('/checkin', ctrlUser.attendance);
router.post('/savePassword', ctrlUser.savePassword);

module.exports = router;



