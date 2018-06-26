const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-west-2',
    endpoint: 'http://localhost:8000',
});
const dynamodb = new AWS.DynamoDB();

// scehma from dynamodump export-schema --region=eu-west-1 --table=PredictionBot --file=PredictionBot
const params = require('./PredictionBot.json');

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});
