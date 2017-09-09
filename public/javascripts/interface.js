var lcd = require("./lcdMock").lcd
var lcd = new lcd();
var stdin = process.openStdin();
var fs = require('fs');
var currentScreen = 0;
var Gpio = require('pigpio').Gpio,

var screens = {
    0: function(){lcd.println(gegevens.min + " tot " + gegevens.max,1); lcd.println("Wekker op " + gegevens.wekker,2);},
    1: function(){lcd.println("Zon op: " + gegevens.vandaagOp,1); lcd.println("Zon on: " + gegevens.vandaagOn, 2)},
    2: function(){lcd.println(vakken(gegevens)[0],1); lcd.println(vakken(gegevens)[1],2)}
}

var start = function(tijdenDB){
var gegevens = tijdenDB;
lcd.clear();
lcd.println(gegevens.min + " tot " + gegevens.max,1);
lcd.println("Wekker op " + gegevens.wekker,2);
lcd.on();
currentScreen = 0;
}

stdin.addListener("data", function(d) {
var gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));
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
      }
});


button2.on('interrupt', function (level) {
if(level === 0){
console.log("Knop 2: ", level);
      }
});

button1.on('interrupt', function (level) {
    if(level === 0){
    console.log("Knop 0: ", level);
          }
    });

button.on('interrupt', function (level) {
if(level === 0){
console.log("Knop 0: ", level);
      }
});


module.exports = {start, update, stop}
