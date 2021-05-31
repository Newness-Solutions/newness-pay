
const nodemailer = require("nodemailer");
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
exports.emailsend = async function(req,res) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "glo3.globexcamhost.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  var mailOptions = {
    from: '"Fapshi" info@newnesol.com', // sender address
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    text: "Yes yes", // plain text body
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
