var express = require('express');
var router = express.Router();
var get = require('../public/javascripts/get');
var interface = require('../public/javascripts/interface');
var alarm = require('../public/javascripts/alarm');
var gegevens = require('../public/DB.json');


get.gegevensVerkrijgen(
    interface.start
);

var nu = new Date();
var mTot10 = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), 22, 0, 0, 0) - nu;
if (mTot10 < 0) {
     mTot10 += 86400000; //Zorgt ervoor dat als het al na 10 uur is dat het naar de volgende dag gaat.
}

var mid = gegevens.wekker.toString().length - 2
var mTotWekker =  new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), gegevens.wekker.toString().substr(0,mid), gegevens.wekker.toString().substr(mid,mid+2), 0, 0) - nu;
if (mTotWekker < 0) {
     mTotWekker += 86400000; //Zorgt ervoor dat als het al na 10 uur is dat het naar de volgende dag gaat.
}

console.log(mTotWekker)
setTimeout(get.gegevensVerkrijgen, mTot10);
setTimeout(alarm.afgaan, mTotWekker)




/* GET home page. */
router.get('/', function (req, res, next) {

    var gegevens = require('../public/DB.json')
    //console.log(gegevens);
    res.render('index', { title: 'ICalendar', wekker: gegevens.wekker , min: gegevens.min, max: gegevens.max, vandaagOp: gegevens.vandaagOp, vandaagOn: gegevens.vandaagOn, dateCreation: gegevens.dateCreation, day: gegevens.day, month: gegevens.month});
});


module.exports = router;
