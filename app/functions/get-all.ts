import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME: string = process.env.TABLE_NAME!;

export const handler: Handler = async (): Promise<any> => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const response = await dynamo.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': '*',
     },
      body: JSON.stringify(response.Items)
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      body: JSON.stringify(dbError)
    };
  }
};
