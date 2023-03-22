const express = require('express');

const loginController = require('../controller/loginController');
const servicesController = require('../controller/servicesController');
const isAuth = require('../middleware/authentication');

const router = express();

router.get('/', loginController.login);

router.post('/verify', loginController.postLogin);

router.post('/otpSubmitted', isAuth, loginController.postOtpSubmission);

router.get('/forgotPassword', loginController.forgotPassword);

router.post('/postForgotPassword', loginController.postForgotPassword);

router.get('/changePassword/:mailId', loginController.changePassword);

router.post('/changedPassword', loginController.changedPassword);

router.post('/addServices', isAuth, servicesController.addServices);

router.post('/serviceAdded', isAuth, servicesController.serviceAdded);

router.post('/deleteServices', isAuth, servicesController.deleteServices);

router.post('/logout', isAuth, loginController.logout);

module.exports = router;