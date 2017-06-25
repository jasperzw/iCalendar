var lcd = require("./lcdMock").lcd
var lcd = new lcd();
var stdin = process.openStdin();
var gegevens = require('../DB.json')
var currentScreen = 0;

var start = function(){
lcd.clear();
lcd.println(gegevens.min + " tot " + gegevens.max,1);
lcd.println("Wekker op " + gegevens.wekker,2);
lcd.on();
currentScreen = 0;
}

stdin.addListener("data", function(d) {
var gegevens = require('../DB.json')
var input = d.toString().trim();
currentScreen = input;
console.log("currentScreen: ", currentScreen);
    screens = {
        0: function(){lcd.println(gegevens.min + " tot " + gegevens.max,1); lcd.println("Wekker op " + gegevens.wekker,2);},
        1: function(){lcd.println("Zon's opgang op " + gegevens.vandaagOp,1); lcd.println("Zon's ondergang op " + gegevens.vandaagOn, 2)}
    }
    screens[currentScreen]();
});

var update = function(){

}

var stop = function(){
lcd.clear();
lcd.off();
}

module.exports = {start, update, stop}
