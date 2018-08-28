let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/to-do-app');

let toDo = mongoose.model('toDo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: String
    }
});

let newToDo = new toDo({
    text: 'Write Python script',
    completed: true,
    completedAt: new Date().toString()
});

newToDo.save().then((docs) => {
    console.log(`Successfully added new to-do! ${docs}`);
}).catch((err) => {
    console.log('Something went wrong! \n', err);
});