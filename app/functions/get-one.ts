import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY!;

const dynamo = new DynamoDB.DocumentClient();

export const handler: Handler = async (event): Promise<any> => {
  const requestedTodoId = event.pathParameters.id;
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
    const response = await dynamo.get(params).promise();
    if (response.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(response.Item)
      };
    } else {
      return {
        statusCode: 404
      };
    }
  } catch (dbError) {
    return {
      statusCode: 500,
      body: JSON.stringify(dbError)
    };
  }
}