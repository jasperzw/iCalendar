var lcd = function() {
    var that = this;
    that.lcdStatus;
    that.contentLcd = ["",""];

    that.test = function(){
        console.log("succesvol geimporteerd");
    }

    that.on = function(){
        that.lcdStatus = 1;
        console.log("The screen is on");
    }
    that.off = function(){
        that.lcdStatus = 0;
        console.log("The screen is of");
    }
    that.println = function(content, line){
        that.contentLcd[line-1] = content;
        console.log("----------------");
        console.log(that.contentLcd[0]);
        console.log(that.contentLcd[1]);
        console.log("----------------");       
    }

    that.clear = function(){
        that.contentLcd = [];
    }
};

var test = function(){
    console.log("soort van geimporteerd");
}

module.exports = {lcd,test};