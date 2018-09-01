const mongoose = require('mongoose');

let toDo = mongoose.model('toDo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String,
        default: null
    }
});

module.exports = {
    toDo
};