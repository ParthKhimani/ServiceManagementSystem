const jwt = require('jsonwebtoken');

const { isJwtExpired } = require('jwt-check-expiration');

const isAuth = (req, res, next) => {
    var cookie = req.cookies;
    if(typeof cookie != 'undefined'){
        const token = req.get('cookie').split("=")[1];
        const refreshToken = isJwtExpired(token);
        if (!refreshToken) {
            const bearerToken = jwt.verify(token, 'thisIsSecrect');
            if (bearerToken) {
                next();
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
}
}

module.exports = isAuth;