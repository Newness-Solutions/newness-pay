const mongoose = require("mongoose");
const validator = require("validator");

const UserGroup = mongoose.model(
    "UserGroup",
    new mongoose.Schema({
        userId: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            // required: True
            }
        ],
        email: {
            type: String,
            validator: validator.isEmail,
            required: true,
            isAsync: false
        },
        permission:{
            type: String,
            enum: ['admin','moderator','user'],
            required:[true, 'Permission level required']

        },

        isValid: {
            type: Boolean,
            default: false,
            required: true,

        }
    },
    {
        timestamps: true
    })
);

module.exports = UserGroup;