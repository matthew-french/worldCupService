const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    accessKey: 'a',
    secretKey: 'a',
});
const dynamodb = new AWS.DynamoDB();

const params = require('./localPredictionBotSchema.json');

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});
