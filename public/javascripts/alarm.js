var Gpio = require('pigpio').Gpio;
var LCD = require('lcdi2c');
var lcd = new LCD( 1,0x3f, 16, 2);
trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
led = new Gpio(25, {mode: Gpio.OUTPUT});
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
    lcd.clear();
    lcd.println("Alarm gaat af!",1);
    lcd.println("Het is " + ('0'+ (nu.getHours() + 2)).slice(-2) + ":" + ('0'+nu.getMinutes()).slice(-2),2);

    dutyCycle = 0;
  
    var ledId = setInterval(function () {
        led.pwmWrite(dutyCycle);
    
        dutyCycle += 5;
        if (dutyCycle > 255) {
        dutyCycle = 0;
        }
    }, 20);

    var triggerId = setInterval(function () {trigger.trigger(10, 1)}, 1000);
    
    (function () {
    var startTick;
    
    echo.on('alert', function (level, tick) {
      var endTick, diff, endAlarm;
      endAlarm = 0;
    
      if (level == 1) {
        startTick = tick;
      } else {
        endTick = tick;
        diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        var afstand = diff / 2 / MICROSECDONDS_PER_CM;
        if(standSet === 0){
            stand = {
                "min": afstand - 10,
                "max": afstand + 10
            }
            standSet = 1;
            console.log(stand);
        } else {
            if(afstand < stand["min"] || afstand > stand["max"]){
                clearInterval(triggerId);
                clearInterval(ledId);
                led.pwmWrite(0);
                lcd.clear();
                nu = new Date();
                lcd.println("TEST 1 " + nu.getHours() + ":" + nu.getMinutes(),1);
                lcd.println("datum: " + nu.getDate() + "/" + (nu.getMonth() + 1),2);
            }
        }
      }
    });
    }());



}

module.exports = {test, afgaan}