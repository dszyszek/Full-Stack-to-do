const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


let userSchema = new mongoose.Schema({

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
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

userSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
}

userSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
  
    try {
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
      return Promise.reject();
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };

  userSchema.pre('save', function (next) {
        let user = this;

        if (user.isModified('password')) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    next();
                });
            });

        } else {
            next();
        }
        
  });

  userSchema.statics.findByCredentials = function (email, password) {
        let user = this;

       return user.findOne({email}).then((usr) => {
            
            if (!usr) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, usr.password, (err, res) => {
                    console.log(res)
                    if (res) {
                        return resolve(usr);
                    }
                    return reject();
                });

            });
        });

  }

let user = mongoose.model('User', userSchema);

module.exports = {
    user
};

//let reg = /([A-Za-z0-9._-]+@+[A-Za-z0-9._-]+\.[A-Za-z])/ig