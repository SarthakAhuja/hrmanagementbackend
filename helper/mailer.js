var mailId
var pass1

exports.sendMail=function(mail,pass){
    mailId=mail
    pass1=pass
    main()
}
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");


async function main(){

  let transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    secure: false, 
    auth: {
      user: "testmail3637@gmail.com",
      pass: "mannu3637" 
    }
  });

  const token =randomstring.generate();
  const url ="http://localhost:3000/createPassword/"+token;
  

 
  let info = await transporter.sendMail({
    from: 'testmail3637@gmail.com', // sender address
    to: mailId, // list of receivers
    subject: "Please confirm your password", // Subject line
    text: "your password is ", // plain text body
    html:  `Hello, PLease click this <a href="${url}"> link`	// html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}