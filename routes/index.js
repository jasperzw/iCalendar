var express = require('express');
var router = express.Router();
var get = require('../public/javascripts/get');
var interface = require('../public/javascripts/interface');
var alarm = require('../public/javascripts/alarm');
var fs = require('fs');
var HvWebBz = 0;

var gegevens = get.gegevensVerkrijgen(function(tijdenDB){
    interface.start(tijdenDB);
    setWekker(tijdenDB);
}
);

function setWekker(gegevens){
    var nu = new Date();
    var mTot10 = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), 22, 0, 0, 0) - nu;
    if (mTot10 < 0) {
         mTot10 += 86400000;
    }

    if (gegevens["wekker"] === undefined){
    console.log("Er is geen wekker gezet voor morgen");
    } else {

        var mid = gegevens.wekker.toString().length - 2
        var mTotWekker =  new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), gegevens.wekker.toString().substr(0,mid), gegevens.wekker.toString().substr(mid,mid+2), 0, 0) - nu;
        if (mTotWekker < 0) {
            mTotWekker += 86400000;
        }

    }

    console.log("milli tot wekker: ", mTotWekker);
    console.log("milli tot 10 uur:", mTot10);

    setTimeout(get.gegevensVerkrijgen, mTot10);
    setTimeout(alarm.afgaan, mTotWekker)
}

/* GET home page. */
router.get('/', function (req, res, next) {
    var gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));
    HvWebBz = HvWebBz + 1;
    console.log(HvWebBz);
    res.render('index', { title: 'ICalendar', wekker: gegevens.wekker , min: gegevens.min, max: gegevens.max, vandaagOp: gegevens.vandaagOp, vandaagOn: gegevens.vandaagOn, dateCreation: gegevens.dateCreation, day: gegevens.day, month: gegevens.month});
});


module.exports = router;
