const fs = require('fs');
var gegevens = JSON.parse(fs.readFileSync('public/DB.json', 'utf8'));

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
console.log(ln1.length);
console.log(ln1, "////", ln2);