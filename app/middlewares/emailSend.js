const axios = require('axios');
const emailConfig = require('../config/email.config');
const url = '/api/sendEmail/';
const config = {
    proxy:{
        host:emailConfig.proxy.host,
        port:emailConfig.proxy.port
    }
};

exports.regConfirmation = (email,username,code) => {
    var option = {
        to: email,
        subject: "Confirm your account",
        content: `
        <h3>Hello ${username},</h3>
        <p>FAPSHI thanks you for registering. Please confirm your email by entering the following code:</p>
        <h4><b> ${code}</b></h4>
        <p>Thank you for trusting us!</p>
        </div>`

    };  
    axios.post(url,option,config)
    .then(()=>{return "Confirmation email sent";})
    .catch((err)=>{console.log(err.response); return "Confirmation email could not be sent";})
}

exports.twoStepVerifMail = (email, username, code) => {
    var option = {
        to: email,
        subject: "Two-step Verification Code",
        content: `
        <h3>Hello ${username},</h3>
        <p>Complete your two-step verification by entering the following code:</p>
        <h4><b> ${code}</b></h4>
        <p>Thank you for trusting us!</p>
        </div>`

    };
    axios.post(url,option,config)
    .then(()=>{return "Confirmation email sent";})
    .catch((err)=>{console.log(err.response); return "Confirmation email could not be sent";})

}

exports.passCode = (email, username, code) => {
    var option = {
        to: email,
        subject: "Password Verification Code",
        content: `
        <h3>Hello ${username},</h3>
        <p>Change your password by entering the following code:</p>
        <h4><b> ${code}</b></h4>
        <p>Thank you for trusting us!</p>
        </div>`

    };
    axios.post(url,option,config)
    .then(()=>{return "Confirmation email sent";})
    .catch((err)=>{console.log(err.response); return "Confirmation email could not be sent";})

}