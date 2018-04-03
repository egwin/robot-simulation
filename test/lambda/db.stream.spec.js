let describe = require("mocha").describe;
let it = require("mocha").it;
let AWS = require('aws-sdk-mock');
let stream_invoke = require("../../src/lambda/db/streamFunction").invoke;
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

process.env.EVENT_ALARM = 'test';

// mock CloudWatchEvents - enableRule,enableRule
AWS.mock('CloudWatchEvents', 'enableRule', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock CloudWatchEvents.enableRule");
    callback(null, "OK");
});
AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
    winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
    callback(null, "OK");
});

describe("test lambda db stream", function() {
    
    // app
    describe("streamFunction to control CloudWatchEvents", function() {
        
        it("enableRule when new insert", function (done) {
            let event = {
                Records: [{eventName: "INSERT"}]
            };
            let context = {};
            stream_invoke(event, context,  function () {
                done();
            });
        });
    
        it("enableRule when modify, powerState is changing from offline to online", function (done) {
            let event = {
                Records: [{
                    eventName: "MODIFY",
                    dynamodb: {
                        NewImage: {
                            powerState: {
                                S: "online"
                            }
                        },
                        OldImage: {
                            powerState: {
                                S: "offline"
                            }
                        }
                    }
                }]
            };
            let context = {};
            stream_invoke(event, context,  function () {
                done();
            });
        });
    
        it("disableRule when modify, powerState is changing from online to offline", function (done) {
            let event = {
                Records: [{
                    eventName: "MODIFY",
                    dynamodb: {
                        NewImage: {
                            powerState: {
                                S: "offline"
                            }
                        },
                        OldImage: {
                            powerState: {
                                S: "online"
                            }
                        }
                    }
                }]
            };
            let context = {};
            stream_invoke(event, context,  function () {
                done();
            });
        });
    
        it("disableRule when remove", function (done) {
            let event = {
                Records: [{eventName: "REMOVE"}]
            };
            let context = {};
            stream_invoke(event, context,  function () {
                done();
            });
        });
    
    });

});