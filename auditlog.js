//console.log(process.argv)
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const createCSV = require('./createCSV');

function ExcelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function parseLog(fileName){
    //10 comma
    let log = [];
    let file = createCSV.createCSV('logs').toString().split('\r\n').toString().split(",")
    for(let i = 0; i<file.length-11; i +=11){
        console.log(file[i])
        if (file[i] !== 'Audit Record Report' && file[i] !== 'Print Time: ' && file[i] !== 'No.'){
            tenant = {};
            tenant.key = file[i+1].replace(/"/g,'');
            tenant.name = file[i+2] + " " + file[i+3];
            console.log(file[i+5])
            tenant.time = new Date((file[i+5] - (25567 + 2))*86400*1000);
            tenant.location = file[i+9];
            log.push(tenant);
            
        }
   
    }
    console.log(log);
    return log;   
}

function readLogFolder(dirName){
    let log = [];
    let fileNames = fs.readdirSync(__dirname + '\\' + dirName);
    for(file in fileNames){
        if(path.extname(fileNames[file]) === '.csv'){
            console.log("Reading file: " + fileNames[file]);
           log = log.concat(parseLog(dirName + '\\' + fileNames[file] ))
        } else {
            console.log("ERROR - Invalid File: " + fileNames[file]);
        }
    }
    return log;
}

//filter passed log
function timeCheck(logArray,start = 20, stop = 6, key = 0, blank = false){
    console.log(start, stop,key)
    let log = logArray.filter(a=>{
        let hour = a.time.getUTCHours()
        if (key !== '0'){
            return a.key === key;
        }   else {
            if(!blank) return a.key !== '0300000000000000' && (hour >= start || hour <= stop) && a.name !== ' ';
            return a.key !== '0300000000000000' && (hour >= start || hour <= stop);
        }
    });
    return log;
    
}

function printLog(log){
    let output = ''
    for (let i=0;i < log.length; i++){
        output += "-------Riff Raff Spotted---------\r\n";
        output += "Tenant: " + log[i].name + '\r\n';
        output += "Key: " + log[i].key + '\r\n';
        output += "Time: " + log[i].time.toString() + '\r\n\r\n';
        
    }
    fs.writeFile("Bum List.txt", output);
}

function smallPrint(log){
    let small = {};
    let output = '';
    for(let i=0;i<log.length;i++){
        if(log[i].key in small){
            small[log[i].key].times.push(ExcelDateToJSDate(log[i].time).toUTCString('en-US') + ' - '+ log[i].location)
        }else{
            let tmp = {}
            tmp.name = log[i].name;
            tmp.key = log[i].key;
            tmp.times = [log[i].time.toUTCString('en-US') + ' - '+ log[i].location];
            //tmp.location = log[i].location;
            small[log[i].key] = tmp;
        }
    }
    for (tenant in small){
        output += "-------Riff Raff Spotted---------\r\n";
        output += "Tenant: " + small[tenant].name + '\r\n';
        output += "Key: " + small[tenant].key + '\r\n';
        output += "Dates: \r\n";
        let times = small[tenant].times;
        for (let i=0;i<times.length;i++){
            output += times[i] + '\r\n';
        }
        output += "\r\n\r\n"

    }
    fs.writeFile("Bum List.txt", output);
}

function main(){
    prompt.start();
    prompt.get([{name: "blank",
                default: false,
                type: 'boolean',
                description: "Show Blank tenants? (t/f) Default - (f)"},
                {name: 'start',
                default: 22,
                type: 'number',
                description: "Start Time 24hr clock"},
                {name: 'stop',
                default: 6,
                type: 'number',
                description: "End Time 24hr clock"},
                {name: 'key',
                default: 0,
                type: 'string',
                description: 'Search for specific key, All logs'}
                ], function (err, result) {
    let log = parseLog();//readLogFolder('logs');
    let filterLog = timeCheck(log,result.start,result.stop, result.key,result.blank);
    smallPrint(filterLog);
  });
    
}

main();
