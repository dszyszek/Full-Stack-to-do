const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose.js');
let {toDo} = require('./models/toDo.js');
let {user} = require('./models/user.js');


let app = express();
let port = process.env.port || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
 
        let text = new toDo({
            text: req.body.text,
            completed: req.body.completed,
            completedAt: req.body.completedAt
        });

        text.save().then((docs) => {
            res.send(docs);
            console.log('Successfully added new content!\n', docs);
        }).catch((err) => {
            res.status(400).send(err);
            console.log('Something went wrong\n', err);
        });

});

app.post('/users', (req, res) => {
        let usr = new user({
            email: req.body.email
        });

        usr.save().then((docs) => {
            res.send(docs);
        }).catch((err) => {
            res.status(400).send(err);
        });
});

app.get('/todos', (req, res) => {

    toDo.find().then((todos) => {
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
};