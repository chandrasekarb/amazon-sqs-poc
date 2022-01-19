const express = require('express');
const bodyParser = require('body-parser');
var uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/config.json');
var sqs = new AWS.SQS({apiVersion: '2016-11-17'});

const queueURL = "SQS_QUEUE_URL";


app.post('/add', (req, res) => {

  let newData = {
      'id': req.body['id'],
      'value': req.body['value'],
  }

  let sqsData = {
      MessageAttributes: {
        "id": {
          DataType: "String",
          StringValue: orderData.id
        },
        "type": {
          DataType: "String",
          StringValue: "add"
        },
      },
      MessageBody: JSON.stringify(newData),
      // MessageDeduplicationId: uuid.v1(),
      // MessageGroupId: "aa@123",
      QueueUrl: queueURL
  };

  let sendSqsMessage = sqs.sendMessage(sqsData).promise();

  sendSqsMessage.then((data) => {
      console.log("Success", data.MessageId);
      res.send("New data added successfully in DB");
  }).catch((err) => {
      console.log("Error", err);
      res.send("We ran into an error. Please try again.");
  });
  
});

app.post('/update', (req, res) => {

  let updateData = {
      'id': req.body['id'],
      'value': req.body['value'],
  }

  let sqsData = {
      MessageAttributes: {
        "id": {
          DataType: "String",
          StringValue: orderData.id
        },
        "type": {
          DataType: "String",
          StringValue: "update"
        },
      },
      MessageBody: JSON.stringify(updateData),
      // MessageDeduplicationId: uuid.v1(),
      // MessageGroupId: "aa@123",
      QueueUrl: queueURL
  };

  let sendSqsMessage = sqs.sendMessage(sqsData).promise();

  sendSqsMessage.then((data) => {
      console.log("Success", data.MessageId);
      res.send("Updated successfully in DB");
  }).catch((err) => {
      console.log("Error", err);
      res.send("We ran into an error. Please try again.");
  });
  
});

app.post('/delete', (req, res) => {

  let deleteData = {
      'id': req.body['id'],
  }

  let sqsData = {
      MessageAttributes: {
        "id": {
          DataType: "String",
          StringValue: orderData.id
        },
        "type": {
          DataType: "String",
          StringValue: "delete"
        },
      },
      MessageBody: JSON.stringify(deleteData),
      // MessageDeduplicationId: uuid.v1(),
      // MessageGroupId: "aa@123",
      QueueUrl: queueURL
  };

  let sendSqsMessage = sqs.sendMessage(sqsData).promise();

  sendSqsMessage.then((data) => {
      console.log("Success", data.MessageId);
      res.send("Data deleted successfully in DB");
  }).catch((err) => {
      console.log("Error", err);
      res.send("We ran into an error. Please try again.");
  });
  
});

console.log('Service listening on port 8080');
app.listen(8080);
