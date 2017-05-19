var express = require('express');
var router = express.Router();
var ical2json = require("ical2json");
var request = require('request');

var aantal = 0;

/* GET home page. */
router.get('/', function (req, res, next) {

    aantal++;

    var output;

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
            if (month < 10) {
                month = "0" + String(month);
            }
            var dateFormatted = (String(year) + String(month) + String(day));
            var end = outputArray[k].DTEND.substr(outputArray[k].DTEND.indexOf('T') + 1)
            var start = outputArray[k].DTSTART.substr(outputArray[k].DTSTART.indexOf('T') + 1);
            var date = outputArray[k].DTSTART.substr(0, outputArray[k].DTSTART.lastIndexOf('T'));
            start = start.substr(0, 4);
            end = end.substr(0, 4);


            console.log((String(year) + String(month) + String(day)), date);

            if (Number(dateFormatted) === Number(date)) {
                dateStart.push({startDate: start, summary: outputArray[k].SUMMARY});
                console.log("gepusht");
            }
            if (Number(dateFormatted) === Number(date)) {
                dateEnd.push(end);
            }

            //Lezen van summary en TODO lezen van javascript object
            //console.log("De les " + outputArray[k].SUMMARY + " begint om " + outputArray[k].DTSTART);
        }
        var min = Math.min.apply(Math, dateStart); //TODO
        var max = Math.max.apply(Math, dateEnd);
        console.log(min, ' tot ', max, ' | ', currentDate);

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
        var wekker = 0;
        alarmTijden.forEach(function(element) {
            if(element['eerstLesUurTijd'] === min){
                console.log(element);
                wekker = element['opstaanTijd'];
            };
        });
        console.log(wekker);
    });

    res.render('index', {title: 'ICalendar', Reload: aantal});
});


module.exports = router;
