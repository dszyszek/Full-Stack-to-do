const mongoose = require('mongoose');
const validator = require('validator');

let user = mongoose.model('User', {

    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        accesss: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

module.exports = {
    user
};

//let reg = /([A-Za-z0-9._-]+@+[A-Za-z0-9._-]+\.[A-Za-z])/ig