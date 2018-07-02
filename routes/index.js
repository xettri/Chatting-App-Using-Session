var express               = require('express');
var router                = express.Router();
var session               = require('express-session');
var bodyParser            = require('body-parser');
var helper                =require('../helper');
const controllers         = require('../Controller')


router.get('/',function(req, res, next) {
    res.render('index');
});

module.exports = router;
