const User = require('../models/user.model');
const createId = require('../middlewares/Ids');

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