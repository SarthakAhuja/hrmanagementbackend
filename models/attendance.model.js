const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var attendanceSchema = new mongoose.Schema({
    loginTime: {
        type: Date,
        // required: 'Full name can\'t be empty'
    },
    logout: {
        type: Date,
        // required: 'Email can\'t be empty',
        unique: true
    },
    userId: {
        type: Number,
        required: 'Password can\'t be empty',
        // minlength: [4, 'UserID must be atleast 4 character long']
    },
   
});

mongoose.model('Attendance', attendanceSchema);