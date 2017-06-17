var express = require('express');
var router = express.Router();
var tools = require('../public/javascripts/get');



tools.gegevensVerkrijgen();

/* GET home page. */
router.get('/', function (req, res, next) {

    var gegevens = require('../public/DB.json')
    console.log(gegevens);
    res.render('index', { title: 'ICalendar', wekker: gegevens.wekker , min: gegevens.min, max: gegevens.max, vandaagOp: gegevens.vandaagOp, vandaagOn: gegevens.vandaagOn, dateCreation: gegevens.dateCreation, day: gegevens.day, month: gegevens.month});
});


module.exports = router;
