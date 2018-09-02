const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/to-do-app', (err, db) => {
    if (err) {
        return console.log('Couldn\'t connect to the database');
    }
    console.log('Successfully connected to the database');

    // Methods of deleting records in database

        // 1) deleteMany
            db.collection('users').deleteMany({age: 20}).then((result) => {
                console.log(result.result);
            });

        // 2) deleteOne   ( -> delete first thing that appears)
        db.collection('users').deleteOne({name: 'Josh'}).then((result) => {
            console.log(result.result);
        });

        // 3) findOneAndDelete      ( -> finds given thing, shows the result and deletes this)

        db.collection('users').findOneAndDelete({_id: new ObjectID('5b8566d99917de54cd0ee07b')}).then((result) => {
            console.log(result);
        });

   // db.close();
});