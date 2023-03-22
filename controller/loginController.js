const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Users = require('../model/users');
const Otp = require('../model/otp');
const services = require('../model/services');

exports.login = (req, res, next) => {
    res.render('loginForm')
}

var message = String(Math.floor((Math.random() * 10000) + 1));

exports.postLogin = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    Users.findOne({ $or: [{ emailId: email }, { adminMailId: email }] })
        .then(result => {
            if (result != null) {
                var registeredPassword = result.password;
                if (password != registeredPassword) {
                    res.render('loginForm', {
                        dataError: '*invalid password!'
                    })
                }
                else {
                    //Store OTP in Collections
                    const otp = new Otp({
                        otp: message,
                        emailId: email
                    })
                    otp.save();

                    //Sending Mail Using NodeMailer for OTP
                    let mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'parthkhimani48@gmail.com',
                            pass: 'appKey'
                        }
                    });

                    let mailDetails = {
                        from: 'parthkhimani48@gmail.com',
                        to: email,
                        subject: 'OTP for verification',
                        text: message
                    };

                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent successfully');
                        }
                    });
                    res.render('otpVerification', {
                        email: email
                    })
                }
            }
            else {
                res.render('loginForm', {
                    dataError: '*Email is not registered!'
                })
            }
        })
}

exports.postOtpSubmission = (req, res, next) => {
    var email = req.body.email;
    var OTP = req.body.otp;
    Otp.findOne({ emailId: email })
        .then(result => {
            var registeredOtp = result.otp;
            if (registeredOtp != OTP) {
                res.render('otpVerification', {
                    otpError: '*please enter valid OTP',
                    email: ''
                });
            }
            else {
                //Set Token and send as a response
                const token = jwt.sign(
                    { emailId: result.emailId },
                    "thisIsSecrect",
                    { expiresIn: '1d' }
                );
                res.cookie('token', token, { httpOnly: true });

                //Fetch Services Table
                services.find({ $or: [{ emailId: email }, { adminMailId: email }] })
                    .then(
                        services => {
                            Users.findOne({ emailId: email })
                                .then(result => {
                                    var role = result.role;
                                    res.render('servicesTable', {
                                        data: services,
                                        role: role,
                                        mailId: email
                                    })
                                })
                        }
                    )
            }
        })
}

exports.forgotPassword = (req, res, next) => {
    res.render('forgotPassword')
}

exports.postForgotPassword = (req, res, next) => {
    var email = req.body.email;
    var link = `<a href="http://localhost:3000/changePassword/${email}">Click here to Change your password</a>`
    Users.findOne({ emailId: email })
        .then(result => {
            if (result != null) {
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'parthkhimani48@gmail.com',
                        pass: 'maatulplnmgqgyio'
                    }
                });

                let mailDetails = {
                    from: 'parthkhimani48@gmail.com',
                    to: email,
                    subject: 'Reset Password Link',
                    html: link
                };

                mailTransporter.sendMail(mailDetails, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent successfully');
                    }
                });
                res.render('forgotPassword', {
                    data: 'Reset Password Link has been sent to you!'
                })
            }
            else {
                res.render('forgotPassword', {
                    dataError: '*Email is not Registered!'
                })
            }
        })
}

var email = null;

exports.changePassword = (req, res, next) => {
    res.render('changePassword');
    email = req.params.mailId;
}

exports.changedPassword = (req, res, next) => {
    var password = req.body.password;
    Users.findOneAndUpdate(email, { password })
        .then(res.redirect('/'))
}

exports.logout = (req, res, next) => {
    res.clearCookie('token');
    // res.render('loginForm');
    res.redirect('/');
}