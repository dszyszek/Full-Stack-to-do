const {MongoClient, ObjectID} = require('mongodb');
const {argv} = require('yargs');

if (argv.id) {
        MongoClient.connect('mongodb://localhost:27017/to-do-app', (err, db) => {
        if (err) {
            return console.log('Cannot connect to the database');
        }
        console.log('SuccessFully connected to the database');

        db.collection('todos').findOneAndDelete({
            _id: new ObjectID(argv.id)
        }).then((result) => {
            console.log('Deleted that \n', result)
        }).catch((err) => {
            console.log('Problem occured! \n', err)
        });

        db.close();
    });
} else {
    return console.log('You have to provide id argument! (--id="id of an object here")');
}



