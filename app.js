const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const router = require('./routes/router');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

mongoose.set("strictQuery", true);
mongoose.connect('mongodb+srv://parth:P%40rth2005@cluster0.eixcpta.mongodb.net/test?retryWrites=true&w=majority')
    .then(app.listen(3000))
    .catch(err => console.log(err));