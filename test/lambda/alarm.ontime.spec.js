let describe = require("mocha").describe;
let it = require("mocha").it;
let AWS = require('aws-sdk-mock');
let alarm_trigger = require("../../src/lambda/alarm/ontime").trigger;
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

let timeRemain = 50000;

// mock SQS - receive,delete
AWS.mock('SQS', 'receiveMessage', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock SQS.receiveMessage");
    callback(null, {
        Messages: [{
            Body: '{"nameTag":"robot1","cmd":"back","current":{"positionX":0,"positionY":3,"direction":"N"},' +
            '"new":{"positionX":0,"positionY":2,"direction":"N"},"change":"positionY"}',
            ReceiptHandle: "testing"
        }]
    });
});
AWS.mock('SQS', 'deleteMessage', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock SQS.deleteMessage");
    timeRemain = 1000;
    callback(null, "OK");
});

// mock DynamoDB - get
AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock dynamoDb.get");
    callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
});

describe("test lambda alarm ontime trigger", function() {
    
    // app
    describe("process sqs message", function() {
        
        it("receive sqs msg -> process -> delete", function (done) {
            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function () {
                done();
            });
        });

    });
    
});