const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

let {toDo} = require('../../models/toDo.js');
let {user} = require('../../models/user.js');

let userOneID = new ObjectID();
let userTwoID = new ObjectID();

let secret = process.env.JWT_SECRET;

let users = [{
    _id: userOneID,
    email: 'example1@ex.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID.toHexString(), access: 'auth'}, secret).toString()
    }]
}, {
    _id: userTwoID,
    email: 'example2@ex.com',
    password: 'userTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID.toHexString(), access: 'auth'}, secret).toString()
    }]
}];

const testToDos = [{
    _id: new ObjectID(),
    text: 'Text1',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'Text2',
    completed: true,
    completedAt: 123,
    _creator: userTwoID
}];

const populateTodos = (done) => {
    toDo.deleteMany({}).then(() => {
        return toDo.insertMany(testToDos);
    }).then(() => done());
};

const populateUsers = (done) => {
    user.remove({}).then(() => {
        let usr1 = new user(users[0]).save();
        let usr2 = new user(users[1]).save();
    
        return Promise.all([usr1, usr2]);
    }).then(() => done());
    
};

module.exports = {
    populateTodos,
    testToDos,
    users,
    populateUsers
};