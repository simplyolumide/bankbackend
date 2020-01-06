const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://wusi24:Confidence24@cluster0-dzwq4.gcp.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err));

const accountSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: Number,
    accountNumber: Number,
    balance: Number,
    createdDate: Date,
    type: String,
    lasttransation: Date,
    transations: [{
        transationType: String,
        amount: Number,
        date: Date
    }]
})

module.exports = mongoose.model('account', accountSchema);



