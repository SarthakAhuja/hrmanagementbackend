var mailId
var sub
var txt
exports.sendMail=function(mail,subject,text){
  return new Promise(function(resolve,reject){
    mailId=mail
    sub=subject
    txt=text
    console.log(sub,txt)
const nodemailer = require("nodemailer");


  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "testmail3637@gmail.com", // generated ethereal user
        pass: "mannu3637" // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
  // send mail with defined transport object
  let info =  transporter.sendMail({
    from: 'testmail3637@gmail.com', // sender address
    to: mailId, // list of receivers
    subject: sub, // Subject line
    text: txt, // plain text body
     // html body
  },function(error,info){
    if(error){
      reject(error)
    }
    else{
      resolve(info)
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  });

})
}