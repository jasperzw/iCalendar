var express = require('express');
var router = express.Router();
var ical2json = require("ical2json");
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {

    var output;

    request.get('https://asg-elo.somtoday.nl/services/webdav/calendarfeed/a87afea9-6794-46f3-8396-9c2effc0a6f3', function (error, response, body) {
        output = ical2json.convert(body);
        console.log(output['VCALENDAR'][0]['VEVENT']);

        var outputArray = output['VCALENDAR'][0]['VEVENT'];

        for (var k = 0; k < outputArray.length;k++) {

            //TODO parse date to readable format. outputArray[k].DTSTART

            console.log("De les " + outputArray[k].SUMMARY + " begint om " + TODO);
        }
    });


  res.render('index', { title: 'jasper134' });
});


module.exports = router;
