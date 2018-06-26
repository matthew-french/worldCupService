const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-west-2',
    endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const getItem = (params) => new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

const params = {
    TableName: 'PredictionBot',
    Key: {
        'userId': 30530369,
    },
};

getItem(params)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
