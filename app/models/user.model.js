const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    phone_number: String,
    group: String,
    date_created: String,
    date_modified: String,
    password: String,
    confirmCode:{
      type: String,
      unique:true
    },
    isValidated: {
      type: Boolean,
      default: false,
      required: true,

    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;