const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/to-do-app', (err, db) => {
    if (err) {
        return console.log('Couldn\'t connect to database');
    }

    console.log('Successfully connected to the database!');

    db.collection('toDo').find({
        _id: new ObjectID('5b82ede3eac48632284c8bde')
    }).toArray().then((docs) => {
        console.log('Docs: \n', JSON.stringify(docs, undefined, 2));
    }).catch((err) => {
        console.log('Error occured', err);
    })

    db.collection('users').find({age: 20}).toArray().then((docs) => {
        console.log('Users: \n', JSON.stringify(docs, undefined, 2));
    }).catch((err) => {
        if (err) {
           return console.log('Error occured!');
        }
    })

   // db.close();
});