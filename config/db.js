const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const getTables = () => new Promise((resolve, reject) => {
    dynamodb.listTables({}, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

const addItem = (params) => new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

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

const deleteItem = (params) => new Promise((resolve, reject) => {
    docClient.delete(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

const query = (params) => new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

const scan = (params) => new Promise((resolve, reject) => {
    let collatedData = [];

    const onScan = (err, data) => {
        if (err) {
            reject(err);
        }
        else if (typeof data.LastEvaluatedKey === 'undefined') {
            collatedData = collatedData.concat(data.Items);
            resolve(collatedData);
        }
        else {
            collatedData = collatedData.concat(data.Items);

            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    };

    docClient.scan(params, onScan);

});

const update = (params) => new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

module.exports = {
    getTables,
    addItem,
    getItem,
    deleteItem,
    query,
    scan,
    update,
};
