// url: https://arcane-falls-77781.herokuapp.com/todos/

require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

let {mongoose} = require('./db/mongoose.js');
let {toDo} = require('./models/toDo.js');
let {user} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate.js');

let app = express();
let port = process.env.PORT;

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
    let body = _.pick(req.body, ['email', 'password']);
    let usr = new user(body);

    usr.save().then(() => {
        return usr.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(usr);
    }).catch((err) => {
        res.status(400).send(err);
    });
}); 

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let email = body.email;
    let password = body.password;

    user.findByCredentials(email, password).then((usr) => {
        usr.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(usr);
        })
    }).catch((e) => {
        res.status(400).send();

    })
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
        
        res.status(200).send({doc});
        console.log('Successfully deleted to-do', doc);

    }).catch( () => {
        console.log('Sth went wrong');
        res.status(400).send()
    });

});

app.delete('/users/me/token', authenticate, (req, res) => {

    // let id = req._id.toHexString();

    // app.findByIdAndRemove(id).then((docs) => {
    //     res.status(200).send(docs);
    // }).catch((err) => res.status(404).send());

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(200).send();
    });

});

app.patch('/todos/:id', (req, res) => {
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
    toDo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
