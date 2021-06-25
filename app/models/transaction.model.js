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
            default: 'top up',
            required:[true, 'Transaction type required']
        },
        medium:{
            type: String,
            enum: ['Mobile money','Orange money','Emy money', 'Fapshi'],
            default: 'Fapshi',
            required:[true, 'Transaction type required']
        },
        status:{
            type: String,
            enum: ['pending','successful','failed'],
            default: 'pending',
            required:[true, 'Transaction status required']
        },
        trans_uuid:{
            type: String,
            default: null
            // required: true
        },
        amount:{
            type: Number,
            min: 0,
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

exports.createTransaction = (data) => {
    var trans = new Transaction(data);
    trans.save((err) => {
        if (err)
            console.log(err)
        return "Transaction saved!"   
    })
}

module.exports = Transaction;