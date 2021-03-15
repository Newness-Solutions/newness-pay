const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.route('/').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Users.findById(req.params.id)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + error));
});

router.route('/:id').delete((req, res) => {
  Users.findByIdAndDelete(req.params.id)
    .then(() => res.json('User Deleted Successfully'))
    .catch((err) => res.status(400).json('Error: ' + error));
});

router.route('/update/:id').post((req, res) => {
  Users.findById(req.params.id)
    .then((users) => {
      users.username = req.body.username;
      users.email = req.body.email;
      users.password = bcrypt.hash(req.body.password, 10, function (hash, err) {
        if (err) {
          return err;
        }
        users.password = hash;
      });

      users
        .save()
        .then(() => res.json('Exercise Added Successfully'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + error));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  let password = bcrypt.hash(req.body.password, 10, function (hash, err) {
    if (err) {
      return err;
    }
    password = hash;
  });

  const newUser = new User({ username, email, password });

  newUser
    .save()
    .then(() => res.json('User added successfully'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
