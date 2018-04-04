let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let rest_action = require("../../src/lambda/rest/action").cmd;
let AWS = require('aws-sdk-mock');
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

describe("test lambda REST", function() {
    
    // action
    describe("REST API ACTION", function() {
        
        it("test action command with success callback", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
            });
            AWS.mock('SQS', 'sendMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.sendMessage");
                callback(null, "OK");
            });
            
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "move,right"
                }
            };
            let context = {};
            rest_action(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(202);
                expect(JSON.parse(result.body).response).to.deep.equal(["OK", "OK"]);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
        it("test action command with error dynamo.get", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback("NG");
            });
            AWS.mock('SQS', 'sendMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.sendMessage");
                callback(null, "OK");
            });
            
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "move"
                }
            };
            let context = {};
            rest_action(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
        it("test action command with error sqs send", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
            });
            AWS.mock('SQS', 'sendMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.sendMessage");
                callback("NG");
            });
            
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "move"
                }
            };
            let context = {};
            rest_action(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
        it("test action command with no change", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
            });
            AWS.mock('SQS', 'sendMessage', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock SQS.sendMessage");
                callback(null, "OK");
            });
            
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "back"
                }
            };
            let context = {};
            rest_action(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(202);
                expect(JSON.parse(result.body).response).to.deep.equal(["NG"]);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
        it("test action invalid endpoint", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "xxx"
                }
            };
            let context = {};
            rest_action(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(400);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
    });
    
});