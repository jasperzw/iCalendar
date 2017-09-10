//var lcd = require("./lcdMock").lcd
//var lcd = new lcd();
var stdin = process.openStdin();
var fs = require('fs');
var currentScreen = 0;
var LCD = require('lcdi2c');
var lcd = new LCD( 1,0x3f, 16, 2);
var Gpio = require('pigpio').Gpio
var gegevens = "";
var Gpio = require('pigpio').Gpio,


screens = {
    0: function(){lcd.clear();lcd.println(gegevens.min + " tot " + gegevens.max,1); lcd.println("Wekker op " + gegevens.wekker,2);},
    1: function(){lcd.clear();lcd.println("Zon op: " + gegevens.vandaagOp,1); lcd.println("Zon on: " + gegevens.vandaagOn, 2)},
    2: function(){lcd.clear();lcd.println(vakken(gegevens)[0],1); lcd.println(vakken(gegevens)[1],2)},
    3: function(){lcd.clear();nu = new Date();lcd.println("het is " + nu.getHours() + ":" + nu.getMinutes(),1); lcd.println("datum: " + nu.getDay() + "/" + nu.getMonth(),2)},
    "stop": function(){lcd.clear(); lcd.off()},
    "start": function(){lcd.clear(); lcd.on()}
}

var start = function(tijdenDB){
 gegevens = tijdenDB;
lcd.clear();
screens[3]();
lcd.on();
}

stdin.addListener("data", function(d) {
gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));
var input = d.toString().trim();
currentScreen = input;
console.log("currentScreen: ", currentScreen);
    screens[currentScreen]();
});

var update = function(){

}

var stop = function(){
lcd.clear();
lcd.off();
}

var vakken = function(gegevens){
    gegevens["dateStart"].sort(function(a, b){
        var keyA = a.startDate,
            keyB = b.startDate;
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
    
    var ln1 = "";
    var ln2 = "";
    for(var i = 0;i < gegevens["dateStart"].length;i++){
        var summary = gegevens["dateStart"][i]["summary"];
        summary = summary.substr(summary.indexOf("-") + 1, summary.length);
        summary = summary.substr(0,summary.indexOf("-")-1).trim().replace("V62", "").replace("ATH6.","").replace(/[0-9]/g, '');
        var a = i+1
        if(ln1.length + summary.length < 17){
            if(ln1.length === 0){ln1 +=(a+summary)} else {ln1 += ("/"+a+summary);}
        } else {
            if(ln2.length === 0){ln2 += (a+summary)} else {ln2 += ("/"+a+summary)};
        }
    }
    var ln = [ln1,ln2];
    return ln;
}


//--------- I/O ---------//


button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
  });
  
  button1 = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
  });
  
    button2 = new Gpio(27, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
  });
  
    button3 = new Gpio(22, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
  });
  
  button3.on('interrupt', function (level) {
  if(level === 0){
  console.log("Knop 3: ", level);
  screens[3]();
        }
  });
  
  
  button2.on('interrupt', function (level) {
  if(level === 0){
  console.log("Knop 2: ", level);
  screens[2]();
        }
  });
  
  button1.on('interrupt', function (level) {
      if(level === 0){
      console.log("Knop 0: ", level);
      screens[1]();
            }
      });
  
  button.on('interrupt', function (level) {
  if(level === 0){
  console.log("Knop 0: ", level);
  screens[0]();
        }
  });


  trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
  echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6/34321;

trigger.digitalWrite(0); // Make sure trigger is low

(function () {
  var startTick;

  echo.on('alert', function (level, tick) {
    var endTick,
      diff;

    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      var afstand = diff / 2 / MICROSECDONDS_PER_CM;
      lcd.clear();
      lcd.println("cm: ", afstand);
    }
  });
}());

// Trigger a distance measurement once per second
var triggerId = setInterval(function () {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);

module.exports = {start, update, stop}
