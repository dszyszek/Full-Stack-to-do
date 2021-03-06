const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

let hashedPassword = '$2a$10$ky06ay/oS79eTX0xJLfAiu.HrriTb0.T5/iDfzw7fSd/BaFbQf.76';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});


/*

============================
Using 'jsonwebtoken' module: 
============================

let hashSalt = 'someSecret';

let data = {
    id: 10
};

let token = jwt.sign(data, hashSalt);

let decoded = jwt.verify(token, hashSalt);

console.log(token);
console.log('Decoded:', decoded);


*/


/*

====================================
Without using 'jsonwebtoken' module: 
====================================

const {SHA256} = require('crypto-js');

let message = 'I am user 3';

let hash = SHA256(message).toString();
let hashSalt = 'someSecret';

console.log(hash);

let data = {
    id: 4
}

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + hashSalt).toString()
}

let resultHash = SHA256(JSON.stringify(token.data) + hashSalt).toString();

if (token.hash === resultHash) {
    console.log('Data is safe');
} else {
    console.log('Data is probably not safe!!!');
}

*/