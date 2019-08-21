const mongoose = require('mongoose');
const config = require('config');

const db = async () => {
    try {
        await mongoose.connect(config.get('dbConnection'), {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('mongodb connection established...');
    } catch (error) {
        console.log('couldn\'t establish mongodb connection...\n', error);
    }
}

module.exports = db;