const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('Attempting to connect to MongoDB...');
console.log('URI starts with:', uri ? uri.substring(0, 20) + '...' : 'UNDEFINED');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect.');
        console.error('Error Name:', err.name);
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
        process.exit(1);
    });
