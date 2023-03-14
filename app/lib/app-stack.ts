import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { LambdaIntegration, Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dynamodb table definition
    const todoTable = new Table(this, "todos", {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      environment: {
        PRIMARY_KEY: 'id',
        TABLE_NAME: todoTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
    }

    // Create a Lambda function for each of the CRUD operations
    const getAllLambda = new NodejsFunction(this, 'getAllTodosFunction', {
      entry: join(__dirname, '../functions/get-all.ts'),
      ...nodeJsFunctionProps,
    });

    const getOneLambda = new NodejsFunction(this, 'getOneTodoFunction', {
      entry: join(__dirname, '../functions/get-one.ts'),
      ...nodeJsFunctionProps,
    });

    const createOneLambda = new NodejsFunction(this, 'createOneTodoFunction', {
      entry: join(__dirname, '../functions/create.ts'),
      ...nodeJsFunctionProps,
    });

    const updateOneLambda = new NodejsFunction(this, 'updateOneTodoFunction', {
      entry: join(__dirname, '../functions/update-one.ts'),
      ...nodeJsFunctionProps,
    });

    const deleteOneLambda = new NodejsFunction(this, 'deleteOneTodoFunction', {
      entry: join(__dirname, '../functions/delete-one.ts'),
      ...nodeJsFunctionProps,
    });

    todoTable.grantReadData(getAllLambda);
    todoTable.grantWriteData(createOneLambda);
    todoTable.grantReadData(getOneLambda);
    todoTable.grantWriteData(updateOneLambda);
    todoTable.grantWriteData(deleteOneLambda);

    const api = new RestApi(this, "todo-app", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    });

    const todos = api.root.addResource('todos');
    todos.addMethod('GET', new LambdaIntegration(getAllLambda));
    todos.addMethod('POST', new LambdaIntegration(createOneLambda));
    // addCorsOptions(todos);

    const singleTodo = todos.addResource('{id}');
    singleTodo.addMethod('GET', new LambdaIntegration(getOneLambda));
    singleTodo.addMethod('PATCH', new LambdaIntegration(updateOneLambda));
    singleTodo.addMethod('DELETE', new LambdaIntegration(deleteOneLambda));
    // addCorsOptions(singleTodo);

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });

  }
}

// export function addCorsOptions(apiResource: IResource) {
//   apiResource.addMethod('OPTIONS', new MockIntegration({
//     integrationResponses: [{
//       statusCode: '200',
//       responseParameters: {
//         'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
//         'method.response.header.Access-Control-Allow-Origin': "'*'",
//         'method.response.header.Access-Control-Allow-Credentials': "'false'",
//         'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
//       },
//     }],
//     passthroughBehavior: PassthroughBehavior.NEVER,
//     requestTemplates: {
//       "application/json": "{\"statusCode\": 200}"
//     },
//   }), {
//     methodResponses: [{
//       statusCode: '200',
//       responseParameters: {
//         'method.response.header.Access-Control-Allow-Headers': true,
//         'method.response.header.Access-Control-Allow-Methods': true,
//         'method.response.header.Access-Control-Allow-Credentials': true,
//         'method.response.header.Access-Control-Allow-Origin': true,
//       },
//     }]
//   })
// }