import { Handler, APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY!;

export const handler = async (event: APIGatewayEvent): Promise<any> => {

  const requestedTodoId = event.pathParameters!.id;
  if (!requestedTodoId) {
    return {
      statusCode: 400,
      body: `Error: You are missing the path parameter id`
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: requestedTodoId
    }
  };

  try {
    await dynamo.delete(params).promise();
    return {
      statusCode: 200,
      body: ''
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      body: JSON.stringify(dbError)
    };
  }
};
