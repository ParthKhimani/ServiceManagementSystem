const nodemailer = require('nodemailer');

const Users = require('../model/users');
const Services = require('../model/services');
const services = require('../model/services');

exports.addServices = (req, res, next) => {
    var adminMailId = req.body.mailId;
    Users.find({ role: 0 })
        .then(result => {
            res.render('addServices', {
                customers: result,
                adminMailId: adminMailId
            })
        })
}

exports.serviceAdded = async (req, res, next) => {
    var adminMailId = req.body.adminMailId;
    var email = req.body.email;
    var service = req.body.service;
    const services = new Services({
        adminMailId: adminMailId,
        emailId: email,
        services: service
    })
    await services.save();
    Services.find()
        .then(result => {
            res.render('servicesTable', {
                data: result,
                role: 1,
                mailId: adminMailId
            })
        })

    //Send confirmation Mail to the customer
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
        subject: 'New Service Added',
        text: 'Added service for : ' + service
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

exports.deleteServices = async (req, res, next) => {
    var del = req.body.delete;
    var mailId = req.body.mailId;
    await Services.findOneAndDelete({ services: del });
    Services.find({ $or: [{ emailId: mailId }, { adminMailId: mailId }] })
        .then(
            services => {
                Users.findOne({ emailId: mailId })
                    .then(result => {
                        var role = result.role;
                        res.render('servicesTable', {
                            data: services,
                            role: role,
                            mailId: mailId
                        })
                    })
            }
        )
}