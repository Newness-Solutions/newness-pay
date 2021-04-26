const db = require("../models");
const Group = db.group;
const User = db.user;


exports.groupCreate = (req, res) => {
    const newGroup = new Group({group_name: req.body.groupName, created_by: req.userId});
    newGroup.save()
    .then(grp => {
        res.status(200).send(grp)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error creating group"
        });
    });
  };
  
  exports.groupGetAll = (req, res) => {
    Group.find()
      .then((groups) => res.status(200).send(groups))
      .catch((err) => res.status(400).json('Error: ' + err));
  };

exports.groupGet = (req, res) => {
    Group.findById(req.params.id)
      .then((groups) => res.status(200).json(groups))
      .catch((err) => res.status(400).json('Error: ' + err));
  };
  
  exports.groupDelete = (req, res) => {
    Group.findByIdAndDelete(req.params.id)
      .then(() => res.status(200).json('Group deleted Successfully!'))
      .catch((err) => res.status(400).json('Error: ' + err));
  };

  exports.groupUpdate = (req, res) => {
    if(!req.body.groupName) {
      return res.status(400).send({
          message: "Group name is required"
      });
    }

    Group.findByIdAndUpdate({_id: req.params.id},
      {
        group_name:  req.body.groupName
  
      }, 
      {new: true})
      .then((groups) => res.status(200).send(groups))
      .catch((err) => res.status(400).json('Error: ' + err))

  }; 

  exports.groupUserGet = (req, res) => {
    User.find({group : req.params.id})
      .then((user) => res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone_number,
        date_created: user.date_created,

      }))
      .catch((err) => res.status(400).json('Error: ' + err));
  };  