const express = require('express');
const app = express();
const { ObjectId } = require("mongodb")

const { connectToDb, getDb } = require('./db.js')
let db;
app.use(express.json())
// var cors = require('cors');
const cors = require("cors");

app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(cors());
connectToDb((err) => {

    app.listen('3001', () => {
        console.log('server is listening at 3001')
    })
    db = getDb()

})

app.get('/', (req, res) => {
    let tickets = [];
    console.log('hi')
    db.collection('ticketdata').find().forEach(ticket => {
        console.log(ticket)
        tickets.push(ticket)
    }).then(() => {
        return res.json(tickets)
    }).catch(() => {
        res.send({ "erorr": "can not fetch a document" })
    })
})

app.post('/', (req, res) => {
    const ticketToBeAdded = req.body;
    db.collection('ticketdata').insertOne(ticketToBeAdded).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ "error": "can't add a document" })
    })
})






//users




app.post('/register', async (req, res) => {
    const userData = req.body;
    let a = 1;
    await db.collection('user').find().forEach(user => {
        if (user.email === userData.email) {
            a = 2;
            console.log(user.email, "before********")
        }
    })
    if(a===2){
        res.send({ "error": "user already exists" })
    }
    console.log('after')
    if (a === 1) {
        db.collection('user').insertOne(userData).then((result) => {
            console.log(result, "after********")
            res.send(result);
        }).catch((err) => {
            res.send({ "error": "can't add a document" })
        })
    }
})