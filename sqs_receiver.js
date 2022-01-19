const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

AWS.config.loadFromPath(__dirname + '/config.json');

const queueURL = "SQS_QUEUE_URL";

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sekar",
  database: 'sqs'
});

con.connect(function(err) {
  if (err) console.log(err);
  else console.log("Connected!");
});


function addData(message) {
  let sqsMessage = JSON.parse(message.Body);
  var sql = `INSERT INTO test (id, value) VALUES ('${sqsMessage.id}', '${sqsMessage.value}')`;
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    else console.log("1 record inserted");
  });
}

function updateData(message) {
  let sqsMessage = JSON.parse(message.Body);
  var sql = `UPDATE test SET value = '${sqsMessage.value}' WHERE id = '${sqsMessage.id}'`;
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    else console.log(result.affectedRows + " record(s) updated");
  });
}

function deleteData(message) {
  let sqsMessage = JSON.parse(message.Body);
  var sql = `DELETE FROM test WHERE id = '${sqsMessage.id}'`;
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    else console.log("Number of records deleted: " + result.affectedRows);
  });}

// Create our consumer
const app = Consumer.create({
    queueUrl: queueURL,
    messageAttributeNames: [
      "id", "type"
    ],
    handleMessage: async (message) => {
      const type = message.MessageAttributes.type.StringValue;
      if (type && type === 'add') {
        addData(message);
      } else if (type && type === 'update') {
        updateData(message);
      } else if (type && type === 'delete') {
        deleteData(message);
      }
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('SQS service is running');
app.start();