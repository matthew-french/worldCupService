const AWS = require('aws-sdk');
const fs = require('fs');
const async = require('async');

AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    accessKey: 'a',
    secretKey: 'a',
});

// var fs = require("fs");
// console.log("\n *START* \n");
// var content = fs.readFileSync("content.txt");
// console.log("Output Content : \n"+ content);
// console.log("\n *EXIT* \n");

const docClient = new AWS.DynamoDB.DocumentClient();
console.log('Importing Cars into DynamoDB. Please wait.');
const data = fs.readFileSync('scripts/dynamodb/predictionBotData.json');
const predictions = JSON.parse(data).map((x) => ({
    'PutRequest': {
        'Item': AWS.DynamoDB.Converter.unmarshall(x),
    },
}));

// console.log(JSON.stringify(predictions, null, 2));

async.eachLimit(predictions, 1000, (row, nextBatch) => {
    const batch = {
        RequestItems: {
            'mattDynamodbTest': [row],
        },
    };

    console.log(JSON.stringify(batch, null, 2));

    docClient.batchWrite(batch, (err, res) => {
        if (err) {
            console.error('Unable to add Params. Error JSON:', JSON.stringify(err, null, 2));
        }
        else {
            console.log('PutItem succeeded:');
            nextBatch(err, res);
        }
    });

}, (err, res) => {
    if (err) {
        console.log(err);
    }
    if (res) {
        console.log('were done!');
    }
});

const params = {
    RequestItems: {
        'mattDynamodbTest': predictions,
    },
};

console.log(predictions.length);

// console.log(JSON.stringify(params, null, 2));

// predictions.forEach((row) => {
//
//     const unmarshalled = AWS.DynamoDB.Converter.unmarshall(row);
//
//     const params = {
//         RequestItems: {
//             'mattDynamodbTest': [
//                 {
//                     'PutRequest': {
//                         'Item': unmarshalled,
//                     },
//                 },
//             ],
//         },
//     };
//
//     // console.log(JSON.stringify(params, null, 2));
// });

// docClient.batchWrite(params, (err, res) => {
//     if (err) {
//         console.error('Unable to add Params. Error JSON:', JSON.stringify(err, null, 2));
//     }
//     else {
//         console.log('PutItem succeeded:');
//     }
// });
