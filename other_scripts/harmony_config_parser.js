const fs = require('fs');
const _ = require('lodash');
const {get, set, trim, cloneDeep} = _;
let fileName = process.argv[2] || './harmony_joehubz.conf';
const lineReader = require('readline').createInterface({
    input: fs.createReadStream(fileName)
});

let configJSON = {};
let currDevice;
lineReader.on('line', function (line) {
    //either activites or commands
    if (!line.startsWith(' ') && line !== '') {
        set(configJSON, line, {});
    } else {
        //activities, needs to be parsed
        if (!get(configJSON, 'Device Commands')) {
            let [actId, actName] = line.split(' - ');
            if (actId) {
                set(configJSON, ['Activities', trim(actId)], actName);
            }
        } else {
            //device name or remote command
            let isDevice = line.startsWith('  ');
            let isCommand = line.startsWith('    ');

            //device name
            if (isDevice && !isCommand) {
                let [devId, devName] = line.split(' - ');
                currDevice = `${devName}:${trim(devId)}`;
                set(configJSON, ['Devices', currDevice], {});
            }
            //command
            else if (isCommand) {
                line = trim(line);
                set(configJSON, ['Devices', currDevice, line], line);
            }
        }
    }
});
lineReader.on('close', function (line) {

    //cleanup final object
    delete configJSON['Device Commands'];

    let outFileName = cloneDeep(fileName);
    outFileName = outFileName.replace('.conf', '');
    outFileName = `${outFileName}.json`;
    fs.writeFile(outFileName, JSON.stringify(configJSON, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outFileName);
        }
    });

});
