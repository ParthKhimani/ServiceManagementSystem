const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    emailId: {
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },
    adminMailId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Service', servicesSchema);