let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let rest_report = require("../../src/lambda/rest/report").status;
let AWS = require('aws-sdk-mock');
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

describe("test lambda REST", function() {
    
    // report
    describe("REST API REPORT", function() {

        it("test report status with success callback", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
            });

            let event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: {
                    show: "all"
                }
            };
            let context = {};
            rest_report(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(200);
                expect(JSON.parse(result.body).location).to.deep.equal({ x: 0, y: 0, d: "N" });
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
    
        it("test report status with success callback, with null query params", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionX: 0, positionY: 0, direction: "N", powerState: "online"}});
            });
        
            let event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: null
            };
            let context = {};
            rest_report(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(200);
                expect(JSON.parse(result.body).location).to.deep.equal({ x: 0, y: 0, d: "N" });
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
        
        it("test report status with error dynamo.get", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback("NG");
            });

            let event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: {
                    show: "all"
                }
            };
            let context = {};
            rest_report(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

        it("test report status with wrong result", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.get");
                callback(null, {Item: {nameTag: "robot1", boardSize: "5x5", positionY: 0, direction: "N", powerState: "online"}});
            });

            let event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: {
                    show: "all"
                }
            };
            let context = {};
            rest_report(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
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
            rest_report(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(400);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

    });

});