const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', usersSchema);