const AWS = require('aws-sdk');
const fs = require('fs');
const async = require('async');

AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    accessKey: 'a',
    secretKey: 'a',
});

const docClient = new AWS.DynamoDB.DocumentClient();

const data = fs.readFileSync('scripts/dataDump/predictionBotData.json');

const Spinner = require('cli-spinner').Spinner;

const spinner = new Spinner('processing.. %s');

spinner.setSpinnerString('|/-\\');

const predictions = JSON.parse(data).map((item) => ({
    'PutRequest': {
        'Item': AWS.DynamoDB.Converter.unmarshall(item),
    },
}));

const batchIterator = (items, nextBatch) => {

    const params = {
        RequestItems: {
            'localPredictionBot': [items],
        },
    };

    docClient.batchWrite(params, (err) => {
        if (err) {
            console.error('Unable to add Params. Error JSON:', JSON.stringify(err, null, 2));
        }
        nextBatch();
    });
};

const batchDone = (err) => {
    spinner.stop(true);
    if (err) {
        console.log(JSON.stringify(err, null, 2));
    }
    console.log(`Were done! ${ predictions.length } items added.`);
};

spinner.start();
async.eachLimit(predictions, 100, batchIterator, batchDone);
