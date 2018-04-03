let describe = require("mocha").describe;
let it = require("mocha").it;
let rest_app = require("../../src/lambda/rest/app").state;
let rest_report = require("../../src/lambda/rest/report").status;
let rest_action = require("../../src/lambda/rest/action").cmd;
let AWS = require('aws-sdk-mock');
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

// mock DynamoDB - put,update,get,delete
AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock dynamoDb.put");
    callback(null, "OK");
});
AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock dynamoDb.update");
    callback(null, "OK");
});
AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock dynamoDb.get");
    callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
});
AWS.mock('DynamoDB.DocumentClient', 'delete', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock dynamoDb.delete");
    callback(null, "OK");
});

// mock SQS - send
AWS.mock('SQS', 'sendMessage', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock SQS.sendMessage");
    callback(null, "OK");
});

describe("test lambda REST", function() {
    
    // app
    describe("REST API APP", function() {
        
        it("test app power", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "power"
                },
                queryStringParameters: {
                    state: "offline"
                }
            };
            let context = {};
            rest_app(event, context,  function () {
                done();
            });
        });
        
        it("test app start", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: {
                    place: "0,0,N"
                }
            };
            let context = {};
            rest_app(event, context,  function () {
                done();
            });
        });
        
        it("test app end", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "end"
                },
                queryStringParameters: {
                    nameTag: "robot1"
                }
            };
            let context = {};
            rest_app(event, context,  function () {
                done();
            });
        });
        
        it("test app invalid endpoint", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "xxx"
                }
            };
            let context = {};
            rest_app(event, context,  function () {
                done();
            });
        });
        
    });
    
    // report
    describe("REST API REPORT", function() {
        
        it("test report status", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: {
                    show: "all"
                }
            };
            let context = {};
            rest_report(event, context,  function () {
                done();
            });
        });
        
        it("test report invalid endpoint", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "xxx"
                }
            };
            let context = {};
            rest_report(event, context,  function () {
                done();
            });
        });
        
    });
    
    // action
    describe("REST API ACTION", function() {
        
        it("test action command", function (done) {
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "move,left,right,back"
                }
            };
            let context = {};
            rest_action(event, context,  function () {
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
            rest_action(event, context,  function () {
                done();
            });
        });
        
    });
});