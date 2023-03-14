import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as App from '../lib/app-stack';

// example resource in lib/app-stack.ts
test('DynamoDB Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new App.AppStack(app, 'TodoStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    "KeySchema": [
      {
        "AttributeName": "id",
        "KeyType": "HASH"
      }
    ],
    "BillingMode": "PAY_PER_REQUEST"
  });
});

test('DynamoDB Lambda Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new App.AppStack(app, 'TodoStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Lambda::Function", {
    "Handler": "index.handler",
    "Runtime": "nodejs16.x"
  });
});


test('API Gateway Http API Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new App.AppStack(app, 'TodoStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::ApiGateway::RestApi", {
    "Name": "todo-app"
  });
});
