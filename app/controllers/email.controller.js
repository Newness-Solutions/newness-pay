const config = require("../config/email.config")
const nodemailer = require("nodemailer");
require('dotenv').config();
const pass = process.env.SECRET

// async..await is not allowed in global scope, must use a wrapper
exports.emailsend = async function(req,res) {

  if(!req.body.secret || req.body.secret!=pass){
    return res.status(403).send({});
  }  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER, 
      pass: process.env.PASSWORD, 
    },
  });

  var mailOptions = {
    from: config.from, // sender address
    to: req.body.to, // receiver
    subject: req.body.subject, // Subject line
    html: req.body.content // html body

  };

  // send mail with defined transport object
   transporter.sendMail(mailOptions,
     (err, info)=>{
       if(err){
         console.log(err);
         return res.status(400).send({message: "Email could not be sent "})
       }else{
         console.log('Email sent: '+ info.response);
         return res.status(200).send({message: "Email sent: " +info.response })
       }
     });
}
