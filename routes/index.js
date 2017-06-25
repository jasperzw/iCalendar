var express = require('express');
var router = express.Router();
var get = require('../public/javascripts/get');
var interface = require('../public/javascripts/interface');



get.gegevensVerkrijgen();

var nu = new Date();
var mTot10 = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), 22, 0, 0, 0) - nu;
if (mTot10 < 0) {
     mTot10 += 86400000; //Zorgt ervoor dat als het al na 10 uur is dat het naar de volgende dag gaat.
}

setTimeout(get.gegevensVerkrijgen, mTot10);

interface.start();

/* GET home page. */
router.get('/', function (req, res, next) {

    var gegevens = require('../public/DB.json')
    //console.log(gegevens);
    res.render('index', { title: 'ICalendar', wekker: gegevens.wekker , min: gegevens.min, max: gegevens.max, vandaagOp: gegevens.vandaagOp, vandaagOn: gegevens.vandaagOn, dateCreation: gegevens.dateCreation, day: gegevens.day, month: gegevens.month});
});


module.exports = router;
