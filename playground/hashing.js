const jwt = require('jsonwebtoken');

let hashSalt = 'someSecret';

let data = {
    id: 10
};

let token = jwt.sign(data, hashSalt);

let decoded = jwt.verify(token, hashSalt);

console.log(token);
console.log('Decoded:', decoded);





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