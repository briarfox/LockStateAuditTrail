//createCSV.createCSV('logs')
const createCSV = require('./createCSV');
const auditlog = require('./auditlog');
const prompt = require('prompt');
const fs = require('fs');
const process = require("child_process");

function main(){
    if (!fs.existsSync('./logs')){
        fs.mkdirSync('./logs');
        console.log("./logs Folder Created. Please add LockState .xlsx files to the folder and re run application.")
    } else {
        console.log("\n***Please place all Lock State excel files into /logs Folder.***\n")
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
                    default: 24,
                    type: 'number',
                    description: "End Time 24hr clock same day"},
                    {name: 'key',
                    default: 0,
                    type: 'string',
                    description: 'Search for specific key, All logs'}
                    ], function (err, result) {
        let logCSV = createCSV.create('logs');
        let log = auditlog.parseLog(logCSV);//readLogFolder('logs');
        let filterLog = auditlog.timeCheck(log,result.start,result.stop, result.key,result.blank);
        auditlog.smallPrint(filterLog);
        process.exec("notepad './bum List.txt'");
    });
    }
    
}

main();