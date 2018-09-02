let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/to-do-app', { useNewUrlParser: true });

module.exports = {
    mongoose
};

