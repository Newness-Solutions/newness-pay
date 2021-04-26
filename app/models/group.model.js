const mongoose = require("mongoose");

const Group = mongoose.model(
    "Group",
    new mongoose.Schema({
        group_name: String,
        created_by: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            }
        ]
    },
    {
        timestamps:true
    })
);

module.exports = Group;