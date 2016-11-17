//createCSV.createCSV('logs')
const createCSV = require('./createCSV');
const auditlog = require('./auditlog');
const prompt = require('prompt');

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
                description: "End Time 24hr clock, next day"},
                {name: 'key',
                default: 0,
                type: 'string',
                description: 'Search for specific key, All logs'}
                ], function (err, result) {
    let logCSV = createCSV.create('logs');
    let log = auditlog.parseLog(logCSV);//readLogFolder('logs');
    let filterLog = auditlog.timeCheck(log,result.start,result.stop, result.key,result.blank);
    auditlog.smallPrint(filterLog);
  });
    
}

main();