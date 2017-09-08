var express = require('express');
var router = express.Router();
<<<<<<< HEAD
var get = require('../public/javascripts/get');
var interface = require('../public/javascripts/interface');
var alarm = require('../public/javascripts/alarm');
var fs = require('fs');

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
=======
var ical2json = require("ical2json");
var request = require('request');
var spawn = require("child_process").spawn;
// var LCD = require('lcdi2c');
// var lcd = new LCD( 1, 0x3f, 16, 2 );
var SunCalc = require('suncalc');

var aantal = 0;

function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return hours + ':' + minutes;
}

/* GET home page. */
router.get('/', function (req, res, next) {

    aantal++;
    var wekker;
    var output;
    var min = 0;
    var max = 0;

    request.get('https://asg-elo.somtoday.nl/services/webdav/calendarfeed/a87afea9-6794-46f3-8396-9c2effc0a6f3', function (error, response, body) {


        output = ical2json.convert(body);
        //console.log(output['VCALENDAR'][0]['VEVENT']);


        var outputArray = output['VCALENDAR'][0]['VEVENT'];

        var dateStart = [];
        var dateEnd = [];

        for (var k = 0; k < outputArray.length; k++) {

            //TODO parse date to readable format. outputArray[k].DTSTART

            var currentDate = new Date();
            var day = currentDate.getDate() + 3
            var month = currentDate.getMonth() + 1
            var year = currentDate.getFullYear()
            var dagHoeveelheid = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            if (dagHoeveelheid < day) {
                month = month + 1;
                day = 1;
            }
            if (month < 10) {
                month = "0" + String(month);
            }
            if (day < 10) {
                day = "0" + String(day);
            }
            var dateFormatted = (String(year) + String(month) + String(day));
            var end = outputArray[k].DTEND.substr(outputArray[k].DTEND.indexOf('T') + 1)
            var start = outputArray[k].DTSTART.substr(outputArray[k].DTSTART.indexOf('T') + 1);
            var date = outputArray[k].DTSTART.substr(0, outputArray[k].DTSTART.lastIndexOf('T'));
            start = parseInt(start.substr(0, 4));
            end = parseInt(end.substr(0, 4));


            // console.log((String(year) + String(month) + String(day)), date);

            if (Number(dateFormatted) === Number(date)) {
                dateStart.push({startDate: start, summary: outputArray[k].SUMMARY});
                //console.log("gepusht");
            }
            if (Number(dateFormatted) === Number(date)) {
                dateEnd.push(end);
            }

            //Lezen van summary en TODO lezen van javascript object
            //console.log("De les " + outputArray[k].SUMMARY + " begint om " + outputArray[k].DTSTART);
        }


        var TempDate = [];
        for (var k = 0; k < dateStart.length; k++) {
            TempDate[k] = dateStart[k]["startDate"]
        }
        min = Math.min.apply(Math, TempDate);
        max = Math.max.apply(Math, dateEnd);
        console.log(min, ' tot ', max, ' | ', currentDate);
        // lcd.clear();
        // lcd.println("Morgen " + min + " tot " + max, 1);


        var alarmTijden = [
            {
                eerstLesUurTijd: 830,
                opstaanTijd: 700
            },
            {
                eerstLesUurTijd: 950,
                opstaanTijd: 830,
            },
            {
                eerstLesUurTijd: 1050,
                opstaanTijd: 940,
            },
            {
                eerstLesUurTijd: 1150,
                opstaanTijd: 1030,
            }
        ];
        alarmTijden.forEach(function (element) {
            if (element['eerstLesUurTijd'] === min) {
                wekker = element['opstaanTijd'];
            }
            ;
        });
        console.log(wekker);

        // lcd.println("Wekker gezet om " + wekker);
        // lcd.on();
>>>>>>> master

    console.log("milli tot wekker: ", mTotWekker);
    console.log("milli tot 10 uur:", mTot10);

    setTimeout(get.gegevensVerkrijgen, mTot10);
    setTimeout(alarm.afgaan, mTotWekker)
}

<<<<<<< HEAD
/* GET home page. */
router.get('/', function (req, res, next) {
    var gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));
    //console.log(gegevens);
    res.render('index', { title: 'ICalendar', wekker: gegevens.wekker , min: gegevens.min, max: gegevens.max, vandaagOp: gegevens.vandaagOp, vandaagOn: gegevens.vandaagOn, dateCreation: gegevens.dateCreation, day: gegevens.day, month: gegevens.month});
=======
        // om de zonsopgang en zonsondergang voor vandaag te krijgen


        var times = SunCalc.getTimes(new Date(), 52.359529,5.239041);
        var vandaagOp = times.sunriseEnd.getHours() + ":" + times.sunriseEnd.getMinutes();
        var vandaagOn = times.sunset.getHours() + ":" + times.sunset.getMinutes();

        var date = new Date();                                  //Snellere methode kan nog toegepast worden bij het controlleren van het rooster.
        date.setDate(date.getDate() + 1);
        times = SunCalc.getTimes(date, 52.359529,5.239041);
        var morgenOp = times.sunriseEnd.getHours() + ":" + times.sunriseEnd.getMinutes();
        var morgenOn = times.sunsetStart.getHours() + ":" + times.sunsetStart.getMinutes();


        res.render('index', {
            title: 'ICalendar',
            Reload: aantal,
            wekker,
            min,
            max,
            vandaagOp,
            vandaagOn,
            morgenOp,
            morgenOn
        });


    });
>>>>>>> master
});


module.exports = router;
