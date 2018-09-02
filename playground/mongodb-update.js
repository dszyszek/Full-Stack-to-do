const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/to-do-app', (err, db) => {

    if (err) {
        return console.log('Couldn\'t connect to the database');
    }
    console.log('Successfully connected to the database!');

    db.collection('users').findOneAndUpdate({
        _id: new ObjectID('5b857a527f7b9f5547698b8d')
    }, {
        $set: {
            name: 'Joshua'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    });


    db.close();
});