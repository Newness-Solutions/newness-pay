const User = require('../models/user.model');
const createId = require('../middlewares/Ids');
const bcrypt = require("bcryptjs");
const mail = require("../middlewares/emailSend");
const enc = require("../middlewares/encryption");
const controller = require("../controllers/user.controller");
const { Buffer } = require("buffer");
require('dotenv').config();
const key = Buffer.from(process.env.ENC_KEY, "base64");

exports.userGet = (req, res) => {
  User.findById(req.params.id)
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
};

exports.userDelete = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json('User deleted Successfully!'))
    .catch((err) => res.status(400).json('Error: ' + err));
};

exports.userUpdate = (req, res) => {
  if(!req.body.username) {
    return res.status(400).send({
        message: "Username is required"
    });
  }
  if(!req.body.email) {
    return res.status(400).send({
        message: "Email is required"
    });
  }
  if(!req.body.phone) {
    return res.status(400).send({
        message: "Phone is required"
    });
  }

  let date = new Date();
  User.findByIdAndUpdate({_id: req.params.id},
    {
      username:  req.body.username,
      email:  req.body.email,
      phone_number:  req.body.phone,
      date_modified: date

    }, 
    {new: true})
    .then(user => res.status(200).send(user))
    .catch((err) => res.status(400).json('Error: ' + err))

}; 

exports.updatePass = (req, res) => {
  User.findByIdAndUpdate({_id:req.userId},
    {
      password: bcrypt.hashSync(req.body.newPass, 8),
      passCode: null
    },
    {new: true})
    .then(() => res.status(200).send({message:"Password updated successfully!"}))
    .catch((err) => res.status(400).send(err));
}

exports.changePass = (req, res) => {
  if(!req.body.secret){
    return res.status(403).send();
  }else{
    User.findById(req.params.id)
    .then((user)=>{
      var encPass = user.passCode;
      var bEncPass = Buffer.from(encPass, 'base64');
      var s = enc.decrypt(bEncPass, key);
      var pass = s.toString()
      s.fill(0);
      bEncPass.fill(0);
      key.fill(0);
      const secret = pass.slice(5);
      if(secret != req.body.secret){
        return res.status(400).send({secret: secret});
      }else{
        req.userId = req.params.id;
        controller.updatePass(req, res);
      }
    })
    .catch((err) => res.status(400).send(err))
  }
}

exports.userGetAll = (_req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).json('Error: ' + err));
};

exports.enableTwoStep = (req, res) => {
  const twoStepCode = createId.makeId(5);
  User.findByIdAndUpdate({_id:req.userId},
    {
      twoStepCode: twoStepCode
    },
    {new: true})
    .then(() => res.status(200).send({message:"Two step authentification enabled successfully!"}))
    .catch((err) => res.status(400).send(err));
}

exports.disableTwoStep = (req, res) => {
  const twoStepCode = null;
  User.findByIdAndUpdate({_id:req.userId},
    {
      twoStepCode: twoStepCode
    },
    {new: true})
    .then(() => res.status(200).send({message:"Two step authentification disabled successfully!"}))
    .catch((err) => res.status(400).send(err));
}

exports.sendPassCode = async (req, res) => {
  const pass = createId.makeId(9);
  const userCode = pass.slice(0,5);
  mail.passCode(req.body.email, req.username, userCode);
  var bPassCode = enc.encrypt(pass, key);
  var passCode = bPassCode.toString('base64');
  bPassCode.fill(0);
  key.fill(0);
  User.findByIdAndUpdate({_id:req.userId},
    {
      passCode: passCode
    },
    {new: true})
    .then((user) => res.status(200).send({id:user._id, message:"Password change code has been sent successfully!"}))
    .catch((err) => res.status(400).send(err));
}

exports.checkPassCode = (req, res) => {
  User.findById(req.params.id)
    .then((users) => {
      if(users){
        var encPass = users.passCode;
        var  bEncPass = Buffer.from(encPass, 'base64');
        var bPass = enc.decrypt(bEncPass, key);
        var pass = bPass.toString();
        bPass.fill(0);
        bEncPass.fill(0);
        key.fill(0);
        var passCode = pass.slice(0,5);
        if(passCode == req.body.passCode){
          var secret = pass.slice(5)
          return res.status(200).send({secret:secret}); 
        }else{
          return res.status(400).send({message:"Invalid code"}); 
        }
      }else{
        return res.status(400).send({message:"Invalid URL"});
      }
      
    })
    .catch(() => res.status(400).send({message:"Invalid URL"}));

}
