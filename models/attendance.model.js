const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var attendanceSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: 'no user id',
         
    },
    loginTime: {
        type: Date,   
    },
    logoutTime:{
        type:Date,
        default:0
    },
    present:{
        type:Number,
        default:0
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