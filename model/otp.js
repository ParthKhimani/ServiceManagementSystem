const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    otp: {
        type: Number,
        required: true
    },
    emailId: String,
    // expireAt: {
    //     type: Date,
    //     default: Date.now(),
    //     expires: 300,
    // }
})

module.exports = mongoose.model('Otp', otpSchema);