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
            min: 0,
            required: true
        }
    },
    {
        timestamps: true
    })
);

exports.newBalance = (data) => {
    var balance = new Balance(data);
    balance.save((err) =>{
        if (err)
            console.log(err);
        return "New Balance registered!";
    })
}


module.exports = Balance;