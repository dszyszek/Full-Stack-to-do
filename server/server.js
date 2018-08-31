const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose.js');
let {toDo} = require('./models/toDo.js');
let {user} = require('./models/user.js');


let app = express();
let port = process.env.port || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
 
    let text = new toDo({
        text: req.body.text
    });

    text.save().then((docs) => {
        res.send(docs);
        console.log('Successfully added new content!\n', docs);
    }).catch((err) => {
        res.status(400).send(e);
        console.log('Something went wrong\n', err);
    });

});

app.listen(port, () => {
    console.log(`App started on port ${port}`)
});