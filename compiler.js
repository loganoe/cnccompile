var data = "";
const fs= require('fs');
var currentx = 0;
var currenty = 0; 
var code = "";
var seperateLines;
var esteps = 34;
var cindex = 1; 
/*
    if (index == 1) {
      stepper.moveTo(4096);
      stepper2.moveTo(4096);
    } 
*/
try {
    data = fs.readFileSync("gcode.ngc", 'utf8');
    seperateLines = data.split(/\r?\n|\r|\n/g);
    console.log("Array being parsed:")
    console.log(seperateLines);
} catch (err) {
    console.error(err);
}
function compile() {
    for (let i = 0; i < seperateLines.length; i++) {
        if (seperateLines[i].includes("G01") && seperateLines[i].includes("X")) {
            console.log("Found move line:");
            console.log(seperateLines[i]);
            console.log("XY data: ")
            var indexx = seperateLines[i].indexOf("X");
            var substringx = seperateLines[i].substring(indexx + 1);
            var finalstrx = substringx.substring(0, substringx.indexOf(" "));
            var xdata = Number(finalstrx);
            console.log(xdata);
            var indexy = seperateLines[i].indexOf("Y");
            var substringy = seperateLines[i].substring(indexy + 1);
            var finalstry = substringy.substring(0, substringy.indexOf(" "));
            var ydata = Number(finalstry);
            console.log(ydata);
            var ydelta = ydata - currenty;
            var xdelta = xdata - currentx; 
            var multiy = ydelta/esteps;
            var multix = xdelta/esteps; 
            currentx = xdata;
            currenty = ydata; 
            var movex = Math.round(multix * 2048);
            var movey = Math.round(multiy * 2048); 
            var xdividend = (Math.abs(xdelta) / Math.abs(ydelta));
            var xspeed;
            var yspeed;
            if (xdividend > 1) {
                 yspeed = 1000 / xdividend;
                 xspeed = 1000;
            } else {
                yspeed = 1000;
                xspeed = 1000 / (Math.abs(ydelta) / Math.abs(xdelta));
            }
            code += "if(index == "+ cindex+") { \n";
            code += "stepper.setMaxSpeed("+Math.floor(xspeed)+"); \n";
            code += "stepper2.setMaxSpeed("+Math.floor(yspeed)+"); \n";
            code += "stepper.moveTo("+movex+"); \n";
            code += "stepper2.moveTo("+movey+"); \n";
            code += "} \n"
            console.log(code);
            cindex++; 
        } else {

        }
    }
}
compile();
fs.writeFile('output.txt', code, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("Export Complete");
})
