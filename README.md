# Skeleton project for Swagger
https://www.codementor.io/codementorteam/how-to-use-json-files-in-node-js-85hndqt32

https://github.com/CascadeEnergy/dynamoDb-marshaler
https://www.npmjs.com/package/dynamodump
https://medium.com/quick-code/node-js-restful-api-with-dynamodb-local-7e342a934a24



// To export the PredictionBot Schema using dynamodump
`$dynamodump export-schema --region=eu-west-1 --table=PredictionBot --file=PredictionBot`

// To export data from live PredictionBot dynamodb
`dynamodump export-data --region=eu-west-1 --table=PredictionBot --file=scripts/dynamodb/predictionBotData.json`






aws dynamodb batch-write-item --request-items file://scripts/dynamodb/predictionRow.json --endpoint-url http://localhost:8000

aws dynamodb list-tables --endpoint-url http://localhost:8000
