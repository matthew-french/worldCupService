# Scripts to pull data from DynamoDb and process to CSV with achievement data.

https://www.codementor.io/codementorteam/how-to-use-json-files-in-node-js-85hndqt32
https://github.com/CascadeEnergy/dynamoDb-marshaler
https://www.npmjs.com/package/dynamodump
https://medium.com/quick-code/node-js-restful-api-with-dynamodb-local-7e342a934a24

// Run docker dynamoDb instance
`$docker run --name dynamodb -d -p 8000:8000 dwmkerr/dynamodb -sharedDb`

// dynamodump PredictionBot live schema dump 
`$dynamodump export-schema --region=eu-west-1 --table=PredictionBot --file=PredictionBot`

// dynamodump PredictionBot live data dump.
`$dynamodump export-data --region=eu-west-1 --table=PredictionBot --file=scripts/dynamodb/predictionBotData.json`

// List local dynamodb tables
`$aws dynamodb list-tables --endpoint-url http://localhost:8000`
