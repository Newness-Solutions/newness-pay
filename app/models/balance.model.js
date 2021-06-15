const mongoose = require("mongoose");

const Balance = mongoose.model(
    "Balance",
    new mongoose.Schema({
        userId: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
            }
        ],
        TransId: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true
            }
        ],
        balance:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    })
);

module.exports = Balance;