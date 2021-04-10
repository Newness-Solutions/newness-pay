let User = require('../models/user.model');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

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
    // .then((users) => {
    //   users.username = req.body.username;
    //   users.email = req.body.email;
    //   users.phone_number = req.body.phone;
    //   // users.password = bcrypt.hash(req.body.password, 10, function (hash, err) {
    //   //   if (err) {
    //   //     return err;
    //   //   }
    //   //   users.password = hash;
    //   // });
    //   users.date_modified = new Date();


    //   users
    //     .save()
    //     .then(() => res.json('User updated Successfully'))
    //     .catch((err) => res.status(400).json('Error: ' + err));
    // })
    // .catch((err) => res.status(400).json('Error: ' + err));

}; 