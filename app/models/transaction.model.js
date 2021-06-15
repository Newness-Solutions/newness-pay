const mongoose = require("mongoose");


const Transaction = mongoose.model(
    "Transaction",
    new mongoose.Schema({
        userId: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
            }
        ],
        type:{
            type: String,
            enum: ['top up','transfer','withdraw'],
            required:[true, 'Transaction type required']
        },
        medium:{
            type: String,
            enum: ['Mobile money','Orange money','Emy money'],
            required:[true, 'Transaction type required']
        },
        status:{
            type: String,
            enum: ['pending','successful','failed'],
            required:[true, 'Transaction status required']
        },
        trans_uuid:{
            type: String,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        mediumId: String,
        reason: String,
        source: String,
        message: String
    },
    {
        timestamps: true
    })
);

module.exports = Transaction;