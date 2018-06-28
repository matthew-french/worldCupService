echo "Stoping and remove dynamodb..."
docker stop dynamodb && docker rm -v dynamodb

echo "Starting local docker of dynamodb instance..."
docker run --name dynamodb -d -p 8000:8000 dwmkerr/dynamodb -sharedDb

# echo "Export PredictionBot Data..."
# dynamodump export-data --region eu-west-1 --table PredictionBot --file ./scripts/dataDump/predictionBotData.json

echo "Create Local DB Schema..."
node scripts/dynamodb/createPredictionBotTable.js

echo "Import Live Data"
node scripts/dynamodb/loadPredictionData.js



# with Persistant data: docker run -v /Users/French/data:/data --name dynamodb -d -p 8000:8000 dwmkerr/dynamodb -dbPath /data
# echo "Stoping and remove redis..."
# docker stop redis && docker rm -v redis
# echo "Run redis..."
# docker run --name redis -d -p 6379:6379 -v /Users/French/data:/data redis

# echo "Start bot with nodemon..."
# nodemon --inspect .
