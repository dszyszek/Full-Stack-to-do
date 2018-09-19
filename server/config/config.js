const env = process.env.NODE_ENV || 'development';
const fs = require('fs');

console.log('env **********', env);


if (env === 'development' || env === 'test') {
    let config = require('./config.json');
    let envConfig = config[env];
    
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

