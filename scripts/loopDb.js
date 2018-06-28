const AWS = require('aws-sdk');
const matchResults = require('./dataDump/matchResults.json');
const achievement = [];

AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000',
    accessKey: 'a',
    secretKey: 'a',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const countCorrectGroupPredictions = (groupPredictions) => {
    let count = 0;
    Object.entries(matchResults.groupsPredictionResults).forEach(([key, value]) => {
        if (key in groupPredictions) {
            if (groupPredictions[key].outcome === value.outcome) {
                count++;
            }
        }
        console.log(`${key} ${value.outcome}`);
    });
    console.log(groupPredictions);
    return count;
};

const scanLogins = (callback) => {

    const params = {
        TableName: 'localPredictionBot',
        Limit: 1,
        Select: 'ALL_ATTRIBUTES',

    };

    const scanData = () => {

        dynamodb.scan(params, (err, data) => {

            if (err) {
                return callback(err);
            }
            else if (data.LastEvaluatedKey) {
                // console.log(data.Count);
                // console.log(data.LastEvaluatedKey);
                // console.log(data.ScannedCount);
                // console.log(data.Items.length);
                const groupAchiements = data.Items.reduce((current, next) => {
                    current.push({ userId: next.userId });
                    current.push({ totalCorrectGroupPredictions: countCorrectGroupPredictions(next.groupsPredictionData) });
                    return current;

                    // console.log(item.topScoringTeam);
                    // console.log(item.groupsPredictionData);
                    // console.log(item.totalYellows);
                    // console.log(item.roundOf16);
                    // console.log(item.winningTeam);
                    // console.log(item.totalReds);
                    // console.log(item.totalGoalsScored);
                    // console.log(item.userId);
                    // console.log(item.totalPenaltiesAwarded);
                }, []);

                console.log(groupAchiements);

                params.ExclusiveStartKey = data.LastEvaluatedKey;

                // return scanExecute(callback);
            }

            return callback(err, data.Items);

        });
    };

    scanData(callback);
};

scanLogins((err, res) => {
    if (err) {
        console.log(err);
    }
    console.log('Success');

    // console.log(res);
}
);
