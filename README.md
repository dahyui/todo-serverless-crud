# Simple TODO CRUD application using AWS serverless
Simple Todo application to run a simple reactjs frontend and backend using AWS CDK to create an API Gateway, Lambda function and DynamoDB database.

## Frontend
```bash
$ cd client
$ yarn install
$ cp .env.example .env
// Set the REACT_APP_HTTP_BASE_URL to the API Gateway URL
```

## Backend
```bash
$ cd app
$ npm install
$ cdk deploy [--profile profile_name]
```

## Future
Integrate AWS IOT Core to stream items from the DB real-time into the frontend.