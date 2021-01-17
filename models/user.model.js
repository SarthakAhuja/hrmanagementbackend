const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        // required: 'Full name can\'t be empty'
    },
    email: {
        type: String,   
        required: 'Email can\'t be empty',
        unique: true
    },
    phone_number: {
        type: Number,
        // required: 'Number can\'t be empty',
        // minlength: [10, 'Number must be atleast 4 character long']
    },
    password:{
        type:String
    },
    role: {
        type: String,
        // required: 'Role can\'t be empty',
        
    }, 
    verificationToken: {
        type: String,
       
    },
    id:{
        type:Number
    },
    status:{
        type:Number,    
        default:0
    },
    saltSecret: String
});


userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


userSchema.pre('save',function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({id: this.id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);