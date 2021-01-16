const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var attendanceSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: 'no user id',
        unique:true  
    },
    loginTime: {
        type: Date,   
    },
    logoutTime:{
        type:Date,
    }
       
});


attendanceSchema.methods.generateJwt = function () {
    return jwt.sign({id: this.id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}
mongoose.model('Attendance', attendanceSchema);