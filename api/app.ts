import { nanoid } from "nanoid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const dynamoDb = require('aws-sdk/clients/dynamodb')

const docClient = new dynamoDb.DocumentClient()

let response:any;
const tableName = 'TodoLists-ini'

export const fetchAllTodo = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=> {
    
    try {

        const todos = await docClient.scan({
            TableName: tableName
        }).promise()

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: todos.Items,
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response;
};

export const fetchTodoBasedOnId = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    try{
        const id = event.pathParameters?.id
        //console.log(typeof id)
            const todo = await docClient.get({
                TableName:tableName,
                Key:{
                    id: id
                }
            }).promise()
        
        response = {
            'statusCode':200,
            'body':JSON.stringify({
                todo:todo.Item
            })
        }

        return response
    }
    catch(err){
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                err,
            }),
        };
        return response
    }
}

export const createTodo = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=> {

    const reqBody = JSON.parse(event.body as string)
    
    try {

        const todo ={
            id:nanoid(8),
            todo:reqBody.todo,
            date:reqBody.date
        }

        const data = await docClient.put({
            TableName: tableName,
            Item:todo
        }).promise()

        console.log(data)
        
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'New todo is created successfully!',
            }),
        };

    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Unable to create a todo',
            }),
        };
    }

    return response;
};

export const updateTodo = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    const reqBody = JSON.parse( event.body as string )
    try {
        await docClient.update({
            TableName:tableName,
            Key: { id: reqBody.id },
                UpdateExpression:
                    "set todo = :todo",
                ExpressionAttributeValues: {
                    ":todo": reqBody.todo
                },
                ReturnValues: "ALL_NEW",
        }).promise();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "success",
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Unable to update todo',
            }),
        };
    }
    return response;
}

export const deleteTodo = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    try{
        const id = event.pathParameters?.id
        console.log(typeof id)
            await docClient.delete({
                TableName:'TodoLists-ini',
                Key:{
                    id: id
                }
            }).promise()
        
        response = {
            'statusCode':200,
            'body':JSON.stringify({
                "Message":"Todo deleted successfully!"
            })
        }

        return response
    }
    catch(err){
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                err,
            }),
        };
        return response
    }
}
