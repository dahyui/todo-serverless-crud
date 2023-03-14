import { Handler, APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME: string = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY!;

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

  enum Status {
    IN_PROGRESS = 1,
    DONE = 2,
  }

export const handler: Handler = async (event: APIGatewayEvent): Promise<any> => {

  if (!event.body) {
    return { statusCode: 400, body: 'Invalid request, you are missing the parameter body' };
  }
  console.log('event.body', typeof event.body, event.body);
  const todo = JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      [PRIMARY_KEY]: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: Status.IN_PROGRESS,
      ...todo
    }
  };

  try {
    await dynamo.put(params).promise();

    return {
      statusCode: 201,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': '*',
     },
      body: ''
    };
  } catch (dbError: any) {
    const errorResponse = dbError?.code === 'ValidationException' && dbError?.message.includes('reserved keyword') ?
      DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;

      return {
      statusCode: 500,
      body: errorResponse
    };
  }
};
