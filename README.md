# Skeleton project for Swagger
https://github.com/CascadeEnergy/dynamoDb-marshaler

https://www.npmjs.com/package/dynamodump

// Export Schema from live db
dynamodump export-schema --region=eu-west-1 --table=PredictionBot --file=PredictionBot

// Dump data from live dynamodb
dynamodump export-data --region=eu-west-1 --table=PredictionBot --file=scripts/dynamodb/predictionBotData.json


https://medium.com/quick-code/node-js-restful-api-with-dynamodb-local-7e342a934a24

dynamodump import-data --region=eu-west-1 --table=mattDynamodbTest --file=scripts/dynamodb/PredictionBotData.json --host=localhost --port=8000

dynamodump import-data --table mattDynamodbTest --file scripts/dynamodb/PredictionBotData.json --host localhost --port 8000



dynamodump export-schema --region=eu-west-1 --accessKey a --secretKey a --table mattDynamodbTest --file=test --host http://localhost:8000


aws dynamodb batch-write-item --request-items file://scripts/dynamodb/predictionRow.json --endpoint-url http://localhost:8000

aws dynamodb batch-write-item --request-items file://request-items.json
