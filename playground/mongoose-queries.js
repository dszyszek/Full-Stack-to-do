const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose.js');
const {toDo} = require('../server/models/toDo.js');
const {user} = require('../server/models/user.js');

let id = '5b8b33145d7bf53ad621e9b7';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid!');
}

user.find({
    _id: id
}).then((todos) => {
    console.log('To-dos', todos);
});

user.findOne({
    _id: id
}).then((todo) => {
    console.log('To-do', todo);
});

user.findById(id).then((todo) => {

    if (!todo) {
        return console.log('ID not found');
    }

    console.log('To-do', todo);
}).catch((err) => console.log(err));
