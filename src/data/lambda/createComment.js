/*
  THIS CODE IS RUN IN THE CLOUD, NOT IN THIS APPLICATION
  STORING HERE FOR REFERENCE
*/
const AWS = require('aws-sdk');
const uuid = require('uuid');
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);

    const params = {
        Item: {
            'retro-board': uuid.v1(),
            'board': 'default',
            'text': body.text,
            'timestamp': new Date().toISOString(),
            'votes': 0,
            'id': body.id || 0,
            'pos': body.pos || 0,
            'col': body.col || 0
        },
        TableName: 'retro-board'
        
    };
    
    let response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "retro-board"
      },
      body: {},
    };
    
    client.put(params,function(err, data) {
      if(err){
        response.body = JSON.stringify(err);
        response.statusCode = 500;
      }else{
        response.body = JSON.stringify({'status': 'success'});
        response.statusCode = 200;
      }
      
      callback(null, response);
        
    });
};