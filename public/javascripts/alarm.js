var Gpio = require('pigpio').Gpio;
trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6/34321;
// Trigger a distance measurement once per second
trigger.digitalWrite(0); // Make sure trigger is low

var test = function(){
    console.log(test);
}

var afgaan = function(){
    var stand;
    var standSet = 0;
    console.log("Ring Ring!!!!");
    var nu = new Date();
    lcd.println("Alarm gaat af! opstaan",1);
    lcd.println("Het is " + nu.getHours() + 2 ":" + nu.getMinutes,2);
    
    var triggerId = setInterval(function () {trigger.trigger(10, 1)}, 1000);
    
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
        if(standSet === 0){
            stand = {
                "min": afstand - 10
                "max": afstand + 10
            }
        } else {
            if(afstand < stand["min"] || afstand > stand["max"]){
                clearInterval(triggerId);
                lcd.clear();
                nu = new Date();
                lcd.println("het is " + nu.getHours() + ":" + nu.getMinutes(),1);
                lcd.println("datum: " + nu.getDate() + "/" + (nu.getMonth() + 1),2);
            }
        }
      }
    });
    }());



}

module.exports = {test, afgaan}