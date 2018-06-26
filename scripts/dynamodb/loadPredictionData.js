const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'eu-west-2',
    endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log('Importing Cars into DynamoDB. Please wait.');
const predictions = JSON.parse(fs.readFileSync('PredictionBotData.json', 'utf8'));

predictions.forEach((row) => {
    console.log(row);

    const params = {
        TableName: 'mattTestDb',
        Item: {
            'userId': car.id,
            'type': car.type,
            'name': car.name,
            'manufacturer': car.manufacturer,
            'fuel_type': car.fuel_type,
            'description': car.description,
        },
    };

    // docClient.put(params, (err, data) => {
    //     if (err) {
    //         console.error('Unable to add Car', car.name, '. Error JSON:', JSON.stringify(err, null, 2));
    //     }
    //     else {
    //         console.log('PutItem succeeded:', car.name);
    //     }
    // });
});
