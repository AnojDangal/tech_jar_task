1. git clone the project
2. create .env file at project root directory and provide value like in example.env file (provide mongodbURl)
2. open the terminal at project root directory and enter command npm i
3. to run the project enter the command npm run dev
4. notification file for watch list can be found inside notification.log file at project root directory
5. error logs and database connection logs can be found inside combined.log file.
6. To call watchlist api end-point is localhost:3000/api/watchlist method type is post and payload should be in format of exact like below 
 {"code": "BTC", "minPrice": 35000 , "maxPrice": 60000 }
 ** no request payload validation and error handling implemented so key's of payload should be exactly like mention above