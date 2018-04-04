let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let rest_app = require("../../src/lambda/rest/app").state;
let AWS = require('aws-sdk-mock');
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

describe("test lambda REST", function() {
    
    // app
    describe("REST API APP", function() {
        
        it("test app power with success callback", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'update', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback(null, "OK");
            });
            
            let event = {
                pathParameters: {
                    endpoint: "power"
                },
                queryStringParameters: {
                    state: "offline"
                }
            };
            let context = {};
            rest_app(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(200);
                expect(JSON.parse(result.body).response).equal("OK");
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });
    
        it("test app power with error dynamo.update", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.update");
                callback("NG");
            });

            let event = {
                pathParameters: {
                    endpoint: "power"
                },
                queryStringParameters: {
                    state: "offline"
                }
            };
            let context = {};
            rest_app(event, context, function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

        it("test app start with success callback", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.put");
                callback(null, "OK");
            });

            let event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: {
                    place: "0,0,N"
                }
            };
            let context = {};
            rest_app(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(201);
                expect(JSON.parse(result.body).response).equal("OK");
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

        it("test app start with error dynamo.put", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.put");
                callback("NG");
            });

            let event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: {
                    place: "0,0,N"
                }
            };
            let context = {};
            rest_app(event, context, function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

        it("test app end with success callback", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'delete', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.delete");
                callback(null, "OK");
            });

            let event = {
                pathParameters: {
                    endpoint: "end"
                },
                queryStringParameters: {
                    nameTag: "robot1"
                }
            };
            let context = {};
            rest_app(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(200);
                expect(JSON.parse(result.body).response).equal("OK");
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

        it("test app end with error dynamo.delete", function (done) {
            AWS.restore();
            AWS.mock('DynamoDB.DocumentClient', 'delete', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock dynamoDb.delete");
                callback("NG");
            });

            let event = {
                pathParameters: {
                    endpoint: "end"
                },
                queryStringParameters: {
                    nameTag: "robot1"
                }
            };
            let context = {};
            rest_app(event, context, function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(500);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
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
            rest_app(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result.statusCode).equal(400);
                expect(JSON.parse(result.body).hasOwnProperty("msg")).equal(true);
                done();
            });
        });

    });

});