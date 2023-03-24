const express = require('express');
const app = express();
// console.log(app)
//app is a object of functions
const { ObjectId } = require("mongodb")
const { connectToDb, getDb } = require('./db.js')
let db;
app.use(express.json())
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

app.get('/tickets', (req, res) => {
    let tickets = [];
    db.collection('ticketdata').find().forEach(ticket => {
        tickets.push(ticket)
    }).then(() => {
        return res.json(tickets)
    }).catch(() => {
        res.send({ "erorr": "can not fetch a document" })
    })
})

app.post('/tickets', (req, res) => {
    const ticketToBeAdded = req.body;
    db.collection('ticketdata').insertOne(ticketToBeAdded).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ "error": "can't add a document" })
    })
})
app.delete('/tickets', async (req, res) => {
    const ticketToBeDeleted = req.query.id;
    let _id = ''
    await db.collection('ticketdata').find().forEach((ticket) => {
        if (parseInt(ticket.id) === parseInt(ticketToBeDeleted)) {
            _id = ticket._id
            return;
        }
    })
    const data = await db.collection('ticketdata').deleteOne({ _id: new ObjectId(_id) })
    if (data.acknowledged == true) {
        res.send('deleted')
    }
    else {
        res.send("can't delete a document")
    }
})
// res.json({ "error": "can't delete a document" })






//users




app.post('/register', async (req, res) => {
    const userData = req.body;
    let a = 1;
    await db.collection('user').find().forEach(user => {
        if (user.email === userData.email) {
            a = 2;
        }
    })
    if (a === 2) {
        res.send({ "error": "user already exists" })
    }
    if (a === 1) {
        db.collection('user').insertOne(userData).then((result) => {
            res.send(result);
        }).catch((err) => {
            res.send({ "error": "can't add a document" })
        })
    }
})


app.post('/logIn', async (req, res) => {
    const dataObject = req.body;
    const email = dataObject.data.email
    const password = dataObject.data.password;

    const user = await db.collection('user').findOne({ email: email })
    if (user) {
        if (user.password === password) {
            res.status(200).send({message:'user exist',name:user.name})
        }
        else {
            res.status(401).send('password is wrong')
        }
    }
    else {
        res.status(404).send({ 'error': 'user does not exit' })
    }
})


const abc = function (a, b) {
    return {
        sum: function sum(a, b) {
            return a + b
        }
    , 
        subtraction: function subtraction(a, b) {
            return a - b
        }
    }
}
// console.log(typeof abc())
// const d=abc();
// console.log(d,d.sum(2,3),d.subtraction(2,3))
// console.log(d(1,2))