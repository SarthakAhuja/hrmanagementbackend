const mongoose = require('mongoose');

var User = mongoose.model('User');
var Attendance =mongoose.model('Attendance')
var Leave =mongoose.model('Leave')
const passport = require('passport');
const _ = require('lodash');
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");
 const commonFunction =  require('../helper/common');
const async = require('async');
const bcrypt = require('bcryptjs');
const moment = require('moment');


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
       
        else if (user) return res.status(200).json({ "token": user.generateJwt() ,"role":user.role});
       
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
    if(req.id) {
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
}else{
    console.log("not admin")
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
                                    "status":1
                                   
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
    var today = new Date().getHours();
    var startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
     
         req.body.present = 1;
         req.body.loginTime =startDate;
         req.body.userId =req.id;
         var attendance =  new Attendance(req.body);

         attendance.save((err,result)=>{
             if(err){
                 console.log(err);
             }else{
                 console.log(result);
                 res.send({message:result,present:result.present})
             }
         })
        }else{
            res.send({message:"not logged in"})
        }

}



module.exports.checkout =  (req,res)=>{
    if(req.id){
        var datee = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
       Attendance.findOne({userId:req.id}).sort({'loginTime':-1}).exec(function(err,user){
         
            if(err)
            {
                res.send({message:"Internal server error"})
            }
            else {
                if(user){
                console.log(user)
                user.updateOne({
                    "logoutTime":datee
                },(err,time)=>{
                    if(err){
                        console.log(err);
                    }else{
                       res.send({message:time});
                        
                    }
                })
            }else{
                res.send({message:"Internal Server error"})
            }
            }
           
        })
        
    }else{
        res.send({message:"User not logged in"})
    }
}


module.exports.getAttendance  = (req,res) =>{ //ek user ki sare attendance
    try{
        if(req.id){
            Attendance.find({userId:req.id},["loginTime","logoutTime","-_id"],(err,attendance)=>{
                if(err){
                    res.send({message:"Internal server error"})
                }
                else{
                    if(attendance){
                        res.status(200).json({attendance})
                    }
                }
            })
        }else{
            res.send({message:"User not logged in"})
        }
    }catch(e){
        res.send({message:e})
    }
}


module.exports.lastWeekAttendance =  (req,res) =>{ //ek user ki last 7 days ki attendance
    if(req.id){
       
        Attendance.find({userId:req.id,$and:[{loginTime:{$lte:moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}},{loginTime:{$gte:moment(new Date ()).subtract(7,"days").format("YYYY-MM-DD HH:mm:ss")}}]},(err,attendance)=>{
            if(err) {
                res.send({message:"Internal server error"})
            }else{
                res.send({attendance})
            }
        })
    
    }else{
        console.log("not logged in")
    }
}

module.exports.employeeDetails =  (req,res)=>{ //sare users ki details
if(req.id){
    User.find({},["fullName",'phone_number',"email","-_id"],(err,users)=>{
        if(err){
        res.send({message:"Internal server error"})
        }
        else{
            if(users){
                res.send({users})
            }else{
                console.log("error")
            }
        }
    })
}

}
module.exports.leave =  (req,res)=>{
    if(req.id){
        if(true){
            var datee =new Date()
        var leave = new Leave();
        leave.days = req.body.days;
        leave.reason = req.body.reason;
        leave.date=req.body.date
        leave.userId = req.id;
        leave.save((err,leaves)=>{
            if(err){
                res.send({message:err})
            } else{
                res.send({message:leaves})
            }
        })
        }else{
            res.send({message:"Insufficient details"})
        }
    }else{
    res.send({message:"Not logged in"})
    }
}

module.exports.getLeave = (req,res)=>{
if(req.id){
    Leave.find({userId:req.id},(err,leaves)=>{
        if(err){
            res.send(err);
                }
                else{
                    res.send({leaves})
                }
    })
}else{
    res.send({message:"not logged in!"})
}
}
module.exports.getAllLeave = (req,res)=>{
    if(req.id){
        
        Leave.find({},(err,leaves)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send({leaves})
        }
        })
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