var express = require('express')
var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.token) {
        res.redirect('/auth/login');
    }
    res.send("dashboard");
});

module.exports = router;