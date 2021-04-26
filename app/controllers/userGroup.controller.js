const db = require("../models"); 
const UserGroup = db.userGroup;


//Add a user to a group
exports.addGroupUser = (req, res) => {
    const newGroupUser = new UserGroup({userId: req.userId, email: req.body.email, permission: req.body.permission});
    newGroupUser.save()
    .then(grp => {
        res.status(200).send(grp)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error adding user"
        });
    });
       
}

exports.deleteGroupUser = (req, res) => {
    const query ={
        userId: req.userId,
        email: req.body.email
    };
    UserGroup.findOneAndDelete(query)
    .then(() => res.status(200).send({message: "User removed successfully"}))
    .catch((err) => res.status(400).send({message: err}))

}

exports.validateUserEmail = (req, res) => {
    UserGroup.findByIdAndUpdate({_id: req.params.id},
        {
            isValid: true
        },
        {new:true})
        .then((UserGrp) => res.status(200).send(UserGrp))
        .catch((err) => res.status(400).send({Error: err}))

}