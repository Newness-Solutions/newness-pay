const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const validatePhone = require("validate-phone-number-node-js");


let checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err1, users) => {
      if (err1) {
        res.status(500).send({ message: err1 });
        return;
      }

      if (users) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

let checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for(const value of req.body.roles){
      if(!ROLES.includes(value)){
        res.status(400).send({
          message: `Failed! Role ${value} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

let isValidPhoneNumber = (req, res, next) => {
  if(req.body.phone){
    if(!validatePhone.validate(req.body.phone)){
      res.status(400).send({
        message: 'Invalid phone number'
      });
      return;
    }
  }else{
    res.status(400).send({
      message: 'Phone number required'
    });
    return;
  }
  next();
};

const verifySignUp = {
  validateAll,
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  isValidPhoneNumber
};

module.exports = verifySignUp;