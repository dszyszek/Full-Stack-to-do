// url: https://arcane-falls-77781.herokuapp.com/todos/

 require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');


let {mongoose} = require('./db/mongoose.js');
let {toDo} = require('./models/toDo.js');
let {user} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate.js');


let app = express();
let port = process.env.PORT;


app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth");
    next();
  });


app.post('/todos', authenticate , (req, res) => {
 
        let text = new toDo({
            text: req.body.text,
            _creator: req.user._id
        });

        text.save().then((docs) => {
            res.send(docs);
            console.log('Successfully added new content!\n', docs);
        }).catch((err) => {
            res.status(400).send(err);
            console.log('Something went wrong\n', err);
        });

});

app.post('/users', async (req, res) => {
   
    try {
        let body = _.pick(req.body, ['email', 'password']);
        console.log(body);
        let usr = new user(body);
        
        await fs.appendFile('./server/logs/log.log', JSON.stringify(body)+ '\n', (e) => {
            if (e) {
                console.log(e);
            }
            console.log('file was created');
        });

        await usr.save();
        const token = await usr.generateAuthToken();
        res.setHeader('x-auth', token).send(usr);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

}); 

app.post('/users/login', async (req, res) => {

    
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const usr = await user.findByCredentials(body.email, body.password);
        const token = await usr.generateAuthToken();

        //res.header('x-auth', token).send(usr);

        res.header('x-auth', token).send([usr, {'x-auth': token}]);
        
    } catch (e) {
        console.log(e, 'POST error');
        res.status(400).send();
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.get('/users', (req, res) => {

    user.find().then((usr) => {
        res.send({usr})
    }).catch((err, res) => {
        res.status(400).send(err);
    });

});


app.get('/todos', authenticate, (req, res) => {

    toDo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        console.log('ID is invalid!');
    }

    toDo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((docs) => {
        if (!docs) {
            console.log('ID not found');
            return res.status(404).send();
        }

        res.send({docs});
        console.log('To-do', docs);
    }).catch((err) => res.status(400).send());

});

app.delete('/todos/:id', authenticate, async (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        console.log('ID not valid!');
    }

    try {
        const doc = await toDo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
    
        if (!doc) {
            console.log('ID not found');
           return res.status(404).send(); 
        }
    
        res.status(200).send({doc});
        console.log('Successfully deleted to-do', doc);
    } catch (e) {
        console.log('Sth went wrong');
        res.status(400).send();
    }
    
});

app.delete('/users/me/token', authenticate, async (req, res) => {

    try{
        await req.user.removeToken(req.token)
        res.status(200).send(user);
    } catch(e) {
        res.status(400).send();
    }  
});


app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    toDo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(404).send());

});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
};
