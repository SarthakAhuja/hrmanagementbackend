const mongoose = require('mongoose');

var User = mongoose.model('User');
var Attendance =mongoose.model('Attendance')
// var Attendance = require('../models/attendance.model')
const passport = require('passport');
const _ = require('lodash');
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");
 const commonFunction =  require('../helper/common');
const async = require('async');
const bcrypt = require('bcryptjs');



module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    
    passport.authenticate('local', (err, user, info) => {       
        
        if (err) return res.status(400).json(err);
       
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
       
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    console.log(req.id)
    User.findOne({ id: req.id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email','role','phone_number']) });
        }
    );
}
module.exports.signup = (req,res)=>
{

    if(req.body.email&&req.body.role&&req.body.phone_number&&req.body.fullName)
    {   req.body.verificationToken =randomstring.generate();
         req.body.id=Date.now();
         var userdata =  new User(req.body);
         console.log("Erororor")
       
       userdata.save().then(function(newuser)
       {
       console.log("new user",newuser)
        
        res.send
        ({   
        msg:'Signup sucess',
        code:200
        }) 
      
       sendMail(req.body.email,req.body.verificationToken,"Succesfull")
       .then(function(sucess)
       {
           if(sucess){
             console.log('sent')
           }
           else{
               console.log('fail')
           }       
       })

       },
          
        function(error)
     {
        console.log('error in signup',error)
        if(error.code==11000)
        {
            res.send
            ({
                error:"user is already registered",
                code:11000
            })
        }
    
         else
         {
          res.send
          ({
          error:'some error occured in user connection',
          code:404
          })
         }
     })
        
    }
    else
    {
        res.send({
            error:"insuffient details"
        })
    }   
    
}

module.exports.savePassword =  (req, res)=> {
    let response = '';
    console.log(req.body, "================");
    let data = req.body;
    try {
      
        if (false) {
            response = "PROVIDE_INFORMATION";
            return res.send({status:false, message: response });
        } else if (data.password != data.confirm_password) {
            response = customMessage.CHECK_CONFIRM_PASSWORD;
            return res.send({status:false, message: response });
        } else {
            async.waterfall([
                function (callback) {
                    User.findOne({verificationToken: data.verificationToken} , (err, userInstance)=> {
                        if (err) {
                            callback({ code: 'error', message: JSON.stringify(err) });
                        } else {
                            console.log(userInstance, "sssssssssssss");
                            if (userInstance) {
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(data.password, salt, (err, hash) => {
                                        data.password = hash;
                                        var saltSecret = salt;
                        
                                    userInstance.updateOne({
                                    "verificationToken": "",
                                    "password":data.password,
                                   
                                }, function (err, result) {
                                    if (err) {
                                        callback({ code: 'error', message: JSON.stringify(err) });
                                    } else {
                                        console.log(result, "result")
                                        callback(null, result);
                                    }
                                });
                                         // next();
                                        });
                                    });
                            } else {
                                callback({ code: 'error', message: "TOKEN_INVALID" });
                            }
                        }
                    });
                }], function (err, response) {
                    if (err) {
                        console.log(err)
                        return res.send({status:false, message: err.message });
                    } else {
                        return res.send({status:true, message:"PASSWORD_CREATED"});
                    }
                });
        }

    } catch (e) {
        console.log(e)
        return res.send({status:false, message: e });
    }
};



module.exports.attendance =  (req,res) =>{

   console.log(req.id)
   if(req.id){
       var datee = new Date();
         req.body.loginTime =datee;
         req.body.userId =req.id;
         var attendance =  new Attendance(req.body);

         attendance.save((err,result)=>{
             if(err){
                 console.log(err);
             }else{
                 console.log(result);
             }
         })
        }else{
            res.send({message:"not logged in"})
        }

}



module.exports.checkout =  (req,res)=>{
    if(req.id){
        var datee = new Date();
       

        Attendance.findOne({userId:req.id},
            (err,user)=>{
            if(err)
            {
                res.send({message:"Internal server error"})
            }
            else{
                if(user){
                    user.updateOne({
                        "logoutTime":datee
                    },(err,time)=>{
                        if(err){
                            console.log(err);
                        }else{
                            if(time){
                                res.send(time);
                            }
                        }
                    })
                }
            }
        })
        
    }else{
        res.send({message:"User not logged in"})
    }
}
var mailId
var tokenID

sendMail=function(mail,token){
    mailId=mail
    tokenID=token
    main()
}
async function main(){

  let transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    secure: false, 
    auth: {
      user: "testmail3637@gmail.com",
      pass: "mannu3637@" 
    }
  });

 
  const url ="http://localhost:3000/createPassword/token="+tokenID;
  

 
  let info = await transporter.sendMail({
    from: 'testmail3637@gmail.com',
    to: mailId, 
    subject: "Please confirm your password",
    text: " ", 
    html:  `Hello, PLease click this <a href="${url}"> link toverify save your passowrd and activate your account`	
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}