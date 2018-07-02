const _isEqual = require('lodash.isequal');

const fs = require('fs');
const newLine = '\r\n';

const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner(`${ newLine }Scanning... %s`);
spinner.setSpinnerString(14);

const AWS = require('aws-sdk');

// live db connection
AWS.config.update({
    region: 'eu-west-1',
    maxRetries: 10,
    retryDelayOptions: {
        base: 1000,
    },
});
const params = {
    TableName: 'PredictionBot',
    Select: 'ALL_ATTRIBUTES',
    Limit: 1000,
};

// local db connection
// AWS.config.update({
//     region: 'eu-west-1',
//     endpoint: 'http://localhost:8000',
//     accessKey: 'a',
//     secretKey: 'a',
// });
// const params = {
//     TableName: 'localPredictionBot',
//     Select: 'ALL_ATTRIBUTES',
// };

const dynamodb = new AWS.DynamoDB.DocumentClient();

const matchResults = require('./dataDump/groupResults.json');
const achievementData = require('./dataDump/achievementData.json');

const outputPath = 'scripts/dataDump/groupPredictionAchievments.csv';

const countCorrectGroupPredictions = (groupPredictions) => {
    let count = 0;
    Object.entries(matchResults.groupsPredictionResults).forEach(([key, value]) => {
        if (groupPredictions) {
            if (key in groupPredictions) {
                if (groupPredictions[key].outcome === value.outcome) {
                    count++;
                }
            }
        }
    });
    return count;
};

const fields = [
    'userId',
    'achievementId',
    'rep',
    'totalCorrectGroupPredictions',
];

fs.writeFile(outputPath, fields + newLine, (err, stat) => {
    if (err) { throw err; }
    console.log(`Create: ${ outputPath }`);
});

spinner.start();

let count = 0;

const scanLogins = (callback) => {

    const scanData = () => {

        let processedBatch = [];

        dynamodb.scan(params, (err, data) => {

            if (err) {
                return callback(err);
            }
            else if (data.LastEvaluatedKey) {
                processedBatch = data.Items.reduce((current, next) => {

                    let totalCorrectGroupPredictions = 0;

                    const userId = next.userId;

                    totalCorrectGroupPredictions = countCorrectGroupPredictions(next.groupsPredictionData);

                    const predictOneGroupMatch = (totalCorrectGroupPredictions >= 1);
                    const predictEightGroupMatchs = (totalCorrectGroupPredictions >= 8);
                    const predictSixteenGroupMatches = (totalCorrectGroupPredictions >= 16);
                    const predictThirtyTwoGroupMatches = (totalCorrectGroupPredictions >= 32);
                    const predictFortyEightGroupMatches = (totalCorrectGroupPredictions === 48);

                    // const topScoringTeam = next.topScoringTeam;
                    // const totalYellows = next.totalYellows;
                    // const roundOf16 = next.roundOf16;
                    // const winningTeam = next.winningTeam;
                    // const totalReds = next.totalReds;
                    // const totalGoalsScored = next.totalGoalsScored;
                    // const totalPenaltiesAwarded = next.totalPenaltiesAwarded;

                    // "predictOneGroupMatch": {
                    //   "id": 18022,
                    //   "rep": 100
                    // },
                    // "predictEightGroupMatchs": {
                    //   "id": 18023,
                    //   "rep": 700
                    // },
                    // "predictSixteenGroupMatches": {
                    //   "id": 18024,
                    //   "rep": 900
                    // },
                    // "predictThirtyTwoGroupMatches": {
                    //   "id": 18025,
                    //   "rep": 1300
                    // },
                    // "predictFortyEightGroupMatches": {
                    //   "id": 18026,
                    //   "rep": 3000
                    // },

                    const achievement = (type) => [
                        userId,
                        achievementData[type].id,
                        achievementData[type].rep,
                        totalCorrectGroupPredictions,
                    ];

                    if (predictOneGroupMatch) {
                        current.push(achievement('predictOneGroupMatch'));
                    }

                    if (predictEightGroupMatchs) {
                        current.push(achievement('predictEightGroupMatchs'));
                    }

                    if (predictSixteenGroupMatches) {
                        current.push(achievement('predictSixteenGroupMatches'));
                    }

                    if (predictThirtyTwoGroupMatches) {
                        current.push(achievement('predictThirtyTwoGroupMatches'));
                    }

                    if (predictFortyEightGroupMatches) {
                        current.push(achievement('predictFortyEightGroupMatches'));
                    }

                    return current;
                }, []);

                const batch = processedBatch.join(newLine);
                count = count + parseInt(data.Count);

                fs.appendFile(outputPath, batch + newLine, (e) => {
                    if (e) {
                        throw e;
                    }
                    console.log(`${ newLine }Appended: ${ data.ScannedCount } items`);
                    console.log('Total Items: ', count);
                    console.log('Last Evaluated Key: ', data.LastEvaluatedKey);
                });

                params.ExclusiveStartKey = data.LastEvaluatedKey;

                // Add delay to throttle request againt dynamoDb
                return setTimeout(() => scanData(callback), 1000);
            }

            return callback(err, processedBatch);

        });
    };

    scanData(callback);
};

console.log(`${ newLine }Starting Scan......`);
scanLogins((err, res) => {
    if (err) {
        throw err;
    }
    spinner.stop(true);
    console.log(`${ newLine }Scan Complete!`);
});
