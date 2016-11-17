const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
//var obj = xlsx.parse(__dirname + '/test.xlsx'); // parses a file
var rows = [];
var writeStr = "";

function create(folder){
    let rows = [];
    let writeStr = "";
    let fileNames = fs.readdirSync(__dirname + '\\' + folder);
    for(file in fileNames){
        //console.log(fileNames[file])
        if(path.extname(fileNames[file]) === '.xlsx'){
            obj = xlsx.parse(__dirname + '/' + folder + '/' + fileNames[file]);
            //console.log("Reading file: " + fileNames[file]);
            for(var i = 0; i < obj.length; i++)
            {
                var sheet = obj[i];
                //loop through all rows in the sheet
                for(var j = 0; j < sheet['data'].length; j++)
                {
                        //add the row to the rows array
                        rows.push(sheet['data'][j]);        
                }
                
            }
        } else {
            console.log("ERROR - Invalid File: " + fileNames[file]);
        }
    }
    
    for(var i = 0; i < rows.length; i++)
    {   
        
        let diff = 11-rows[i].length;
       
        for(let j = 0; j < diff; j++){
            rows[i].push("");
        }
        writeStr += rows[i].join(",") + "\r\n";
    }
    //writeStr = writeStr.replace(/"/g,'/"')
    writeStr = writeStr.toString().replace(/"/g,'')
    return writeStr;

}

exports.create = create;

