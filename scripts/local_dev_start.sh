docker run --name dynamodb -d -p 8000:8000 dwmkerr/dynamodb

# echo "Stoping and remove redis..."
# docker stop redis && docker rm -v redis
# echo "Run redis..."
# docker run --name redis -d -p 6379:6379 -v /Users/French/data:/data redis

# echo "Start bot with nodemon..."
# nodemon --inspect .
