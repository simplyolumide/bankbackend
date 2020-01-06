const express = require("express");
const cors = require('cors');

const port = process.env.PORT || 3001

var app = express()
app.use(express.json());
app.use(cors());

let Account = require('./account');

getCount = async() => {
    const account = await Account.find();
    return account.length;
}


// Defined store route
app.post("/account/create", (req, res) => {
    if(req.body.balance >= 1000){
        getCount();
        let account = new Account(req.body);

        getCount().then(count => {
            account.accountNumber = 2174868427 + count;
            account.transations.push({
                "transationType": "Initial Deposit",
                "amount": account.balance,
                "date": new Date().toLocaleString()
            });
            account.date = new Date().toLocaleString();
            account.lasttransation = new Date().toLocaleString();
            account.save()
            .then(account => {
                res.status(200).json({
                    'type': 'success',
                    'message': 'Account created successfully. Your Account Number is ' + account.accountNumber
                });
            })
            .catch(err => {
                res.status(400).send({ "type": "danger", "message" : "Unable to save to database" });
            });
        })
    }else{
        res.status(400).send({
            "type" : "danger",
            "message" : "Initial deposit should be #1000 or more"
        });
    }
});

app.get("/account/:accountNumber", (req, res) => {
    Account.find({
        accountNumber: req.params.accountNumber
    }, function (err, account) {
        res.json(account[0]);
    });
});

app.get("/account/transations/:accountNumber", (req, res) => {
    Account.find({
        accountNumber: req.params.accountNumber
    }, function (err, account) {
        res.json(account[0].transations);
    });
});

app.put("/account/deposit/:accountNumber", (req, res) => {
    Account.find({
        accountNumber: req.params.accountNumber
    }, function (err, accountArr) {

        if (!accountArr)
            res.status(404).send("data is not found");
        else {
            if (Number(req.body.amount) > 1) {
                let account = accountArr[0];
                account.balance = account.balance + Number(req.body.amount);
                account.transations.push({
                    "transationType": "Deposit",
                    "amount": Number(req.body.amount),
                    "date": new Date().toLocaleString()
                });
                account.lasttransation = new Date().toLocaleString();
                account.save().then(account => {
                        res.json({ "type": "success", "data" : account});
                    })
                    .catch(err => {
                        res.status(400).send({ "type": "danger", "message" : "unable to update the database"});
                    });
            } else {
                res.status(400).send({ "type": "danger", "message" : "Deposit amount should be more than #500"});
            }

        }
    });
});

app.put("/account/withdraw/:accountNumber", (req, res) => {
    Account.find({
        accountNumber: req.params.accountNumber
    }, function (err, accountArr) {

        if (!accountArr)
            res.status(404).send("Account Number is not found");
        else {
            let account = accountArr[0];
            account.balance = account.balance - Number(req.body.amount);
            if (account.balance > 1000) {
                account.transations.push({
                    "transationType": "Withdraw",
                    "amount": Number(req.body.amount),
                    "date": new Date().toLocaleString()
                });
                account.lasttransation = new Date().toLocaleString();
                account.save().then(account => {
                        res.json({ "type": "success", "data" : account});
                    })
                    .catch(err => {
                        res.status(400).send({ "type": "danger", "message" : "unable to update the database"});
                    });
            } else {
                res.status(400).send({ "type": "danger", "message" : "Insufficient Balance, you cannot withraw less than #1000 "});
            }
        }
    });
});

app.listen(port, () => console.log(`Account Services listening on port ${port}!`));