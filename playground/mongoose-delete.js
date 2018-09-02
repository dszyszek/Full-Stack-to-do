const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose.js');
const {toDo} = require('../server/models/toDo.js');
const {user} = require('../server/models/user.js');

/*
toDo.remove({}).then((result) => {
    console.log(result.result);
});
*/

toDo.findOneAndRemove({_id: '5b8c1c518aac75001404272f'}).then((result) => {
    console.log(result);
});

toDo.findByIdAndRemove('5b8b5722cdaf7f4112ab648b').then((result) => {
    console.log(result);
})