const _isEqual = require('lodash.isequal');

const fs = require('fs');
const newLine = '\r\n';

const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('Scanning... %s');
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
    Limit: 10,
    Select: 'ALL_ATTRIBUTES',
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
//     Limit: 100,
// };

const dynamodb = new AWS.DynamoDB.DocumentClient();

const predictionResults = require('./dataDump/predictionResults.json');
const achievementData = require('./dataDump/achievementData.json');

const outputPath = 'scripts/dataDump/otherPredictionAchievments.csv';

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
    'bTotalReds',
    'bTotalYellows',
    'bTotalGoalsScored',
    'bTotalPenaltiesAwarded',
    'bRoundOf16',
    'bQuarters',
    'bSemis',
    'bFinal',
    'bWinningTeam',
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

                    const userId = next.userId;
                    const bTotalReds = (next.totalReds === predictionResults.totalReds);
                    const bTotalYellows = (next.totalYellows === predictionResults.totalYellows);
                    const bTotalGoalsScored = (next.totalGoalsScored === predictionResults.totalGoalsScored);
                    const bTotalPenaltiesAwarded = (next.totalPenaltiesAwarded === predictionResults.totalPenaltiesAwarded);
                    const bRoundOf16 = (_isEqual(next.roundOf16, predictionResults.roundOf16));
                    const bQuarters = (_isEqual(next.quarters, predictionResults.quarters));
                    const bSemis = (_isEqual(next.semis, predictionResults.semis));
                    const bFinal = (_isEqual(next.final, predictionResults.final));
                    const bWinningTeam = (next.winningTeam === predictionResults.winningTeam);

                    console.log(newLine + newLine);
                    console.log({ userId });
                    console.log({ bTotalReds }, next.totalReds, predictionResults.totalReds);
                    console.log({ bTotalYellows }, next.totalYellows, predictionResults.totalYellows);
                    console.log({ bTotalGoalsScored }, next.totalGoalsScored, predictionResults.totalGoalsScored);
                    console.log({ bTotalPenaltiesAwarded }, next.totalPenaltiesAwarded, predictionResults.totalPenaltiesAwarded);
                    console.log({ bRoundOf16 }, next.roundOf16, predictionResults.roundOf16);
                    console.log({ bQuarters }, next.quarters, predictionResults.quarters);
                    console.log({ bSemis }, next.semis, predictionResults.semis);
                    console.log({ bFinal }, next.final, predictionResults.final);
                    console.log({ bWinningTeam }, next.winningTeam, predictionResults.winningTeam);

                    const achievement = (type) => [
                        userId,
                        achievementData[type].id,
                        achievementData[type].rep,
                        bTotalReds,
                        bTotalYellows,
                        bTotalGoalsScored,
                        bTotalPenaltiesAwarded,
                        bRoundOf16,
                        bQuarters,
                        bSemis,
                        bFinal,
                        bWinningTeam,
                    ];

                    if (bTotalReds) {
                        current.push(achievement('totalReds'));
                    }
                    if (bTotalYellows) {
                        current.push(achievement('totalYellows'));
                    }
                    if (bTotalGoalsScored) {
                        current.push(achievement('totalGoalsScored'));
                    }
                    if (bTotalPenaltiesAwarded) {
                        current.push(achievement('totalPenaltiesAwarded'));
                    }
                    if (bRoundOf16) {
                        current.push(achievement('roundOf16'));
                    }
                    if (bQuarters) {
                        current.push(achievement('quarters'));
                    }
                    if (bSemis) {
                        current.push(achievement('semis'));
                    }
                    if (bFinal) {
                        current.push(achievement('final'));
                    }
                    if (bWinningTeam) {
                        current.push(achievement('winningTeam'));
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
                // return setTimeout(() => scanData(callback), 1000);
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
