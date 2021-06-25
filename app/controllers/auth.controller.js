const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mail = require("../middlewares/emailSend");
const config = require("../config/auth.config");
const db = require("../models");
const createId = require('../middlewares/Ids');
const User = db.user;
const Role = db.role;
const Trans = db.transaction;
const Balance = db.balance;

exports.signup = (req, res) => {
  const code = createId.makeId(6); 
  const users = new User({
    username: req.body.username,
    email: req.body.email,
    phone_number: req.body.phone,
    date_created: Date(),
    confirmCode: code,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  users.save(async(err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    const confirmMail = await mail.regConfirmation(req.body.email, req.body.username, code);

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err1, roles) => {
          if (err1) {
            res.status(500).send({ message: err1 });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err2 => {
            if (err2) {
              res.status(500).send({ message: err2 });
              return;
            }

            res.send({ message: "User was registered successfully!" });
            return confirmMail;
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err3, role) => {
        if (err3) {
          res.status(500).send({ message: err3 });
          return;
        }

        user.roles = [role._id];
        user.save(err4 => {
          if (err4) {
            res.status(500).send({ message: err4 });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }

  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      if(!user.isValidated){
        return res.status(401).send({message: "Unvalidated user account"});
      }

      if(user.twoStepCode){ //if two-step vefication is active
        mail.twoStepVerifMail(user.email, user.username, user.twoStepCode);
        return res.status(200).send({id: user._id, message: "Enter code from email"});

      }else{
        userInfo(user, res);
    }
    });
};

exports.twoStepVerif = (req, res) => {
  User.findById(req.body.id)
  .populate("roles", "-__v")
  .exec((err, user) => {
    if (err) {
      return  res.status(500).send({ message: "Invalid user ID"});
    }
    if(user.twoStepCode != req.body.twoStepCode){
      return res.status(400).send({message: "Invalid two-step verification code"});
    }else{
      const twoStepCode = createId.makeId(5);
      User.findByIdAndUpdate({_id:req.body.id},
        {
          twoStepCode: twoStepCode
        },
        {new: true})
        .then(() => {
          userInfo(user, res);
        })  
        .catch((error) => res.status(400).send(error))
    }
  })
}

exports.checkCode = (req, res) => {
  User.findOne({
    email: req.body.email
  })
  .populate("roles", "-__v")
  .exec((err, user) => {
    if (err) {
      return  res.status(500).send({ message: err });
    }
    if(user.isValidated){
      return res.status(403).send({message: "Account already validated"})
    }
    if(req.body.code === user.confirmCode){
      const trans = new Trans({
        userId: user._id,
        status: "successful",
        amount: 0
      });
      trans.save((er, val)=>{
        if(er)
          console.log(er);
        const balance = new Balance({
          userId: user._id,
          TransId: val._id,
          balance: 0
        });
        balance.save();
      })
      User.findByIdAndUpdate({_id: user._id},
        {
          isValidated: true,
          confirmCode: null
        }, 
        {new: true, useFindAndModify: false})
        .then(() => {
          userInfo(user, res);
        })
        .catch((error) => {res.status(400).send({message: error})})
    }else{
      return res.status(400).send({message: "Invalid Confirmation code"});
    }
  })   
}


function userInfo(user, res){ 

  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });

  var authorities = [];

  for(const val of user.roles){
    authorities.push("ROLE_"+ val.name.toUpperCase());
  }
  return res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone_number,
    date_created: user.date_created,
    roles: authorities,
    accessToken: token
  });
}
