var fs = require('fs');
var gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));
console.log("Gegevens:");
console.log(gegevens);

if (gegevens["wekker"] === undefined){
    console.log("Er is geen wekker gezet voor morgen");
} else {
    var nu = new Date();
    var mid = gegevens.wekker.toString().length - 2
    var mTotWekker =  new Date(nu.getFullYear(), nu.getMonth(), nu.getDate(), gegevens.wekker.toString().substr(0,mid), gegevens.wekker.toString().substr(mid,mid+2), 0, 0) - nu;
    if (mTotWekker < 0) {
        mTotWekker += 86400000; //Zorgt ervoor dat als het al na 10 uur is dat het naar de volgende dag gaat.
    }
    console.log(mTotWekker);
}