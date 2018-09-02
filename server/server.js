const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose.js');
let {toDo} = require('./models/toDo.js');
let {user} = require('./models/user.js');


let app = express();
let port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        console.log('ID is invalid!');
    }

    toDo.findById(id).then((docs) => {
        if (!docs) {
            console.log('ID not found');
            return res.status(404).send();
        }

        res.send({docs});
        console.log('To-do', docs);
    }).catch((err) => res.status(400).send());

});

app.delete('/todos/:id', (req, res) => {

    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        console.log('ID not valid!');
    }

    toDo.findByIdAndRemove(id).then((doc) => {
        if (!doc) {
            console.log('ID not found');
           return res.status(404).send(); 
        }
        
        res.status(200).send(doc);
        console.log('Successfully deleted to-do', doc);

    }).catch( () => {
        console.log('Sth went wrong');
        res.status(400).send()
    });

});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
};