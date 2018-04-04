let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let AWS = require('aws-sdk-mock');
let alarm_trigger = require("../../src/lambda/alarm/ontime").trigger;
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

describe("test lambda alarm ontime trigger", function() {

    describe("process sqs message", function() {

        it("receive sqs msg -> process -> delete, with success handler", function (done) {
            let timeRemain = 50000;
            AWS.restore();
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
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with error sqs receive", function (done) {
            let timeRemain = 50000;
            AWS.restore();
            AWS.mock('SQS', 'receiveMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.receiveMessage");
                timeRemain = 1000;
                callback("NG");
            });
            AWS.mock('SQS', 'deleteMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.deleteMessage");
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with no sqs msg receive", function (done) {
            let timeRemain = 50000;
            AWS.restore();
            AWS.mock('SQS', 'receiveMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.receiveMessage");
                timeRemain = 1000;
                callback(null, {});
            });
            AWS.mock('SQS', 'deleteMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.deleteMessage");
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with error sqs delete", function (done) {
            let timeRemain = 50000;
            AWS.restore();
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
                callback("NG");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with error dynamo.update", function (done) {
            let timeRemain = 50000;
            AWS.restore();
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
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                timeRemain = 1000;
                callback("NG");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with power state offline", function (done) {
            let timeRemain = 50000;
            AWS.restore();
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
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                timeRemain = 1000;
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 3, direction: "N", powerState: "offline"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with wrong msg scheme", function (done) {
            let timeRemain = 50000;
            AWS.restore();
            AWS.mock('SQS', 'receiveMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.receiveMessage");
                timeRemain = 1000;
                callback(null, {
                    Messages: [{
                        Body: '{"nameTag":"robot1","cmd":"back",' +
                        '"new":{"positionX":0,"positionY":2,"direction":"N"},"change":"positionY"}',
                        ReceiptHandle: "testing"
                    }]
                });
            });
            AWS.mock('SQS', 'deleteMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.deleteMessage");
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 1, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("receive sqs msg -> process -> delete, with wrong location", function (done) {
            let timeRemain = 50000;
            AWS.restore();
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
                callback(null, "OK");
            });
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                timeRemain = 1000;
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 1, positionY: 3, direction: "N", powerState: "online"}});
            });
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });

            let event = {};
            let context= {
                getRemainingTimeInMillis: function() {
                    return timeRemain;
                }
            };
            alarm_trigger(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

    });

});