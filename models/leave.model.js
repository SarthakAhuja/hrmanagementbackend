const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

var leaveSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: 'no user id',
         
    },
    days: {
        type: Number,
        required:true   
    },
    date:{
        type:Date,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    }
    
});


mongoose.model('Leave', leaveSchema);