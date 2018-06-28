const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const outFilePath = 'scripts/dataDump/matchResults.json';
const url = 'https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json';

const safelyParseJSON = (json) => {
    try { return JSON.parse(json); }
    catch (e) { return console.log(e); }
};

const results = {
    winningTeam: 'germany',
    totalReds: '19',
    totalYellows: '19',
    totalGoalsScored: '187',
    totalPenaltiesAwarded: '18',
    roundOf16: [
        'argentina',
        'belgium',
        'brazil',
        'france',
        'germany',
        'portugal',
        'spain',
        'uruguay',
    ],

};

const achievementsData = {
    totalYellows: {
        id: 18017,
        rep: 3000,
    },
    totalReds: {
        id: 18018,
        rep: 3000,
    },
    totalGoalsScored: {
        id: 18019,
        rep: 3000,
    },
    totalPenaltiesAwarded: {
        id: 18020,
        rep: 3000,
    },
    topScoringTeam: {
        id: 18021,
        rep: 500,
    },
    predictOneGroupMatch: {
        id: 18022,
        rep: 100,
    },
    predictEightGroupMatchs: {
        id: 18023,
        rep: 700,
    },
    predictSixteenGroupMatches: {
        id: 18024,
        rep: 900,
    },
    predictThirtyTwoGroupMatches: {
        id: 18025,
        rep: 1300,
    },
    predictFortyEightGroupMatches: {
        id: 18026,
        rep: 3000,
    },
    roundOf16: {
        id: 18027,
        rep: 300,
    },
    quarters: {
        id: 18028,
        rep: 200,
    },
    semis: {
        id: 18029,
        rep: 200,
    },
    final: {
        id: 18030,
        rep: 200,
    },
    winningTeam: {
        id: 18031,
        rep: 700,
    },
};

const axios = require('axios');

const getDataFromConfig = () =>
    axios.get(url)
        .then((res) => ({
            teams: res.data.teams,
            groups: res.data.groups,
        })
        )
        .catch((err) => console.log('Not a valid config file path', err));

const getTeam = (teamId, teams, results) => ({
    id: teams[teamId - 1].id,
    name: teams[teamId - 1].name,
    region: teams[teamId - 1].iso2,
    result: results,
});

const getWinTeam = (homeTeamId, homeTeamResult, awayTeamId, awayTeamResult, teamData) => {
    const prepString = (teamNameString) => teamNameString.toLowerCase().replace(/\s/g, '');

    if (homeTeamResult > awayTeamResult) {
        return prepString(teamData[homeTeamId - 1].name);
    }

    if (homeTeamResult < awayTeamResult) {
        return prepString(teamData[awayTeamId - 1].name);
    }

    return 'draw';
};

const saveAsJSON = (data) => {
    const jsonSpacing = 2;
    const json = JSON.stringify(data, null, jsonSpacing);
    return fs.writeFileAsync(outFilePath, json, 'utf8');
};

const createOutputData = () =>
    getDataFromConfig()
        .then((data) => {
            const groupsPredictionResults = {};

            Object.keys(data.groups).forEach((key) => {
                const group = data.groups[key];
                group.matches.forEach((val) => {
                    groupsPredictionResults[`match${ val.name }`] = {
                        date: val.date,
                        matchId: val.name,
                        team1: getTeam(val.home_team, data.teams, val.home_result),
                        team2: getTeam(val.away_team, data.teams, val.away_result),
                        outcome: getWinTeam(val.home_team, val.home_result, val.away_team, val.away_result, data.teams),
                    };
                });
            });

            return { groupsPredictionResults };
        })
        .then((data) => saveAsJSON(data));

createOutputData();
