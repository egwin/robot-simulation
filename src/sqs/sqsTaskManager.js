const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const SQS = new AWS.SQS();
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

const HTTP_URL_SQS_QUEUE = "https://sqs.ap-southeast-1.amazonaws.com/288329435957/" + process.env.SQS_QUEUE;


let sqsTaskManager = (function () {
    return {
        sendMsg: function (msg) {
            let params = {
                QueueUrl: HTTP_URL_SQS_QUEUE,
                MessageBody: JSON.stringify(msg, null, 4)
            };
    
            return new Promise(function(resolve, reject) {
                // send sqs msg
                SQS.sendMessage(params, function (err, data) {
                    if (err) {
                        winston.log("error", "SqsTaskManager sendMsg error", err);
                        reject(err.stack);
                
                    } else {
                        winston.log("verbose", "SqsTaskManager sendMsg successfully, data:", data);
                        resolve("OK");
                    }
                });
            });
        },
    
        receiveMsg: function () {
            let params = {
                QueueUrl: HTTP_URL_SQS_QUEUE,
                MaxNumberOfMessages: 10,
                VisibilityTimeout: 5
            };
    
            return new Promise(function(resolve, reject) {
                // receive sqs msg
                SQS.receiveMessage(params, function (err, res) {
                    if (err) {
                        winston.log("error", "SqsTaskManager receiveMsg error", err);
                        reject(err.stack);
                
                    } else {
                        winston.log("verbose", "SqsTaskManager receiveMsg successfully, res.Messages:", res.Messages);
                        resolve(res.Messages);
                    }
                });
            });
        },
    
        deleteMsg: function (msg) {
            let params = {
                QueueUrl: HTTP_URL_SQS_QUEUE,
                ReceiptHandle: msg.ReceiptHandle
            };
    
            return new Promise(function(resolve, reject) {
                // delete sqs msg
                SQS.deleteMessage(params, function (err, data) {
                    if (err) {
                        winston.log("error", "SqsTaskManager deleteMsg error", err);
                        resolve(err);
                
                    } else {
                        winston.log("verbose", "SqsTaskManager deleteMsg successfully");
                        reject("OK");
                    }
                });
            });
        }
    }

}());

module.exports = sqsTaskManager;