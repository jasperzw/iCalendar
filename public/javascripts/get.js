var gegevensVerkrijgen = function(callback){
var ical2json = require("ical2json");
var request = require('request');
var SunCalc = require('suncalc');
var fs = require("fs");
const iCalAdress = require("../../iCalAdress.js").iCalAdress;

var digitControle = function(vr){
if (vr < 10) {
                vr = "0" + String(vr);
                return vr;
            }
return vr;
}

    var wekker = "0000";
    var output;
    var min = 0;
    var max = 0;

    request.get(iCalAdress, function (error, response, body) {
        var times = SunCalc.getTimes(new Date(), 52.3367572, 5.2355392);
        
        var vandaagOp = times.sunrise.getHours() + ":" + digitControle(times.sunrise.getMinutes());
        var vandaagOn = times.sunset.getHours() + ":" + digitControle(times.sunset.getMinutes());

        var date = new Date();                                  //Snellere methode kan nog toegepast worden bij het controlleren van het rooster.
        date.setDate(date.getDate() + 1);
        times = SunCalc.getTimes(date, 52.3367572, 5.2355392);       
        var morgenOp = times.sunrise.getHours() + ":" + digitControle(times.sunrise.getMinutes());
        var morgenOn = times.sunset.getHours() + ":" + digitControle(times.sunset.getMinutes());
        output = ical2json.convert(body);
        //console.log(output['VCALENDAR'][0]['VEVENT']);


        var outputArray = output['VCALENDAR'][0]['VEVENT'];

        var dateStart = [];
        var dateEnd = [];

        for (var k = 0; k < outputArray.length; k++) {

            //TODO parse date to readable format. outputArray[k].DTSTART

            var currentDate = new Date();
            var day = digitControle(currentDate.getDate() - 2);
            var day = digitControle(currentDate.getDate() - 1);
            var month = digitControle(currentDate.getMonth() + 1);
            var year = currentDate.getFullYear();
            var dagHoeveelheid = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            if (dagHoeveelheid < day) {
                month = month + 1;
                day = 1;
            }

            var dateFormatted = (String(year) + String(month) + String(day));
            var end = outputArray[k].DTEND.substr(outputArray[k].DTEND.indexOf('T') + 1)
            var start = outputArray[k].DTSTART.substr(outputArray[k].DTSTART.indexOf('T') + 1);
            var date = outputArray[k].DTSTART.substr(0, outputArray[k].DTSTART.lastIndexOf('T'));
            start = parseInt(start.substr(0, 4));
            end = parseInt(end.substr(0, 4));


             //console.log((String(year) + String(month) + String(day)), date);

            if (Number(dateFormatted) === Number(date)) {
                dateStart.push({ startDate: start, summary: outputArray[k].SUMMARY });

                //console.log("gepusht");
            }
            if (Number(dateFormatted) === Number(date)) {
                dateEnd.push(end);
            }

        }


        var TempDate = [];
        for (var k = 0; k < dateStart.length; k++) {
            TempDate[k] = dateStart[k]["startDate"]
        }
        min = Math.min.apply(Math, TempDate);
        max = Math.max.apply(Math, dateEnd);
        //console.log(min, ' tot ', max, ' | ', currentDate);
        

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
            };
        
        });
        //console.log("WekkerVar: ", wekker);
        nu = new Date();
        var tijdenDB = {
            "wekker"       : wekker,
            "min"          : min,
            "max"          : max,
            "dateStart"    : dateStart,
            "dateEnd"      : dateEnd,
            "dateCreation" : new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), (nu.getHours() + 2), nu.getMinutes(), nu.getSeconds(),nu.getMilliseconds()),
            "vandaagOp"    : vandaagOp,
            "vandaagOn"    : vandaagOn,
            "day"          : day,
            "month"        : month
        }

        fs.writeFile("public/DB.json", JSON.stringify(tijdenDB), "utf8");
        callback(tijdenDB);
        return tijdenDB;
    });
}

module.exports = {gegevensVerkrijgen: gegevensVerkrijgen}
