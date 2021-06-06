const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;
const UserGroup = db.userGroup;

let verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

let sameUser = (req, res, next) => {
  // This method be used with the verifyToken methood.
  if(req.userId == req.params.id){
    next();
  }else{
    return res.status(401).send({message: "Unauthorized action!"});
  }
};


let validPassword = (req, res, next) => {
  User.findById(req.userId)
  .then((user)=>{
    var isValidPass = bcrypt.compareSync(
      req.body.oldPass,
      user.password
    );
    if(isValidPass){
      next();
    }else{
      return res.status(400).send({message: "Invalid old password"})
    }
  })
  .catch((err)=>{return res.status(500).send({ message: err });})
  
}

let isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err1, roles) => {
        if (err1) {
          res.status(500).send({ message: err1 });
          return;
        }
        for (const value of roles){
          if(value === "admin"){
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
      }
    );
  });
};


let checkDuplicateEmail = (req, res, next) => {
  // Email
  UserGroup.findOne({
    userId: req.userId,
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    next();
  });
};


let emailExists = (req, res, next) =>{
  if(!req.body.email){
    return res.status(400).send({message: "Email required!"})
  }
  User.findOne({email:req.body.email})
  .then((user)=>{
    if(user){
      req.username = user.username;
      req.userId = user._id;
      next();
    }else{
      return res.status(400).send({messsge: "No user account with this email"})
    }
  })
  .catch(()=>{ return res.status(500).send({ message: "No user account with this email!" }); })

}

let isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err1, roles) => {
        if (err1) {
          res.status(500).send({ message: err1 });
          return;
        }
        for (const value of roles){
          if(value === "moderator"){
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });        
      }
    );
  });
};


const authJwt = {
  verifyToken,
  sameUser,
  validPassword,
  isAdmin,
  checkDuplicateEmail,
  emailExists,
  isModerator
};
module.exports = authJwt;