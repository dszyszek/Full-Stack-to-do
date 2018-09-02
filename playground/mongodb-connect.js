//const mongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/to-do-app', (err, db) => {
    if (err) {
        return console.log('Couldn\'t connect to database ');
    }
    console.log('Successfully connected to the database!');


    db.collection('toDo').insertOne({
        text: 'Task',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert data', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    let names = ['Damian', 'Josh', 'Bill', 'Terry', 'Roger'];

        for(let m=0; m<5; m++){
            db.collection('users').insertOne({
                name: names[m],
                age: Math.max(Math.floor(Math.random()*50), 20)
            }, (err, result) => {
                if (err) {
                    return console.log('Unable to do that!', err);
                }
                console.log(JSON.stringify(result.ops, undefined, 2));
            });
        }
    
    //console.log(Object.keys(db.collection('users')).length);
    

    db.close();
});