// const jsonexport = require('jsonexport');
// const fs = require('fs');
//
// const reader = fs.createReadStream('dump.json');
// const writer = fs.createWriteStream('out.csv');
//
// console.log(reader);
//
// reader.pipe(jsonexport()).pipe(writer);

const fs = require('fs');
const json2csv = require('json2csv');
const newLine = '\r\n';

let fields = ['Total', 'Name'];

const appendThis = [
    {
        'Total': '100',
        'Name': 'myName1',
    },
    {
        'Total': '200',
        'Name': 'myName2',
    },
];

const toCsv = {
    data: appendThis,
    fields,
    hasCSVColumnTitle: false,
};

fs.stat('file.csv', (err, stat) => {
    if (err == null) {
        console.log('File exists');

        // write the actual data and end with newline
        const csv = json2csv(toCsv) + newLine;

        fs.appendFile('file.csv', csv, (err) => {
            if (err) { throw err; }
            console.log('The "data to append" was appended to file!');
        });
    }
    else {
        // write the headers and newline
        console.log('New file, just writing headers');
        fields = (fields + newLine);

        fs.writeFile('file.csv', fields, (err, stat) => {
            if (err) { throw err; }
            console.log('file saved');
        });
    }
});
