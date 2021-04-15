const mongoose = require("mangoose");

const Group = mongoose.model(
    "Group",
    new mongoose.Schema({
        group_name: String,
        created_by: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            }
        ],
        date_created: String
    })
);

module.exports = Group;