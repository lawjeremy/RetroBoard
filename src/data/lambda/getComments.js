/*
  THIS CODE IS RUN IN THE CLOUD, NOT IN THIS APPLICATION
  STORING HERE FOR REFERENCE
*/
const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var params = {
      TableName : 'retro-board',
      FilterExpression : 'board = :board',
      ExpressionAttributeValues : {':board' : 'default'}
    };
    
    let response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "x-custom-header" : "retro-board",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials" : true,
      },
      body: {},
    };
    
    client.scan(params,function(err, data) {
      if(err){
        response.body = JSON.stringify(err);
        response.statusCode = 500;
      }else{
        response.body = data;
        response.statusCode = 200;
      }
      
      callback(null, response);
        
    });
};