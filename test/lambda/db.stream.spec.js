let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let AWS = require('aws-sdk-mock');
let stream_invoke = require("../../src/lambda/db/streamFunction").invoke;
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

describe("test lambda db stream", function() {

    // app
    describe("streamFunction to control CloudWatchEvents", function() {

        it("enableRule when new data is inserted in DB", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'enableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.enableRule");
                callback(null, "OK");
            });
            AWS.mock('Lambda', 'invokeAsync', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock Lambda.invokeAsync");
                callback(null, "OK");
            });
            
            let event = {
                Records: [{eventName: "INSERT"}]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
    
        it("enableRule when new data is inserted in DB, with error CloudWatchEvents", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'enableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.enableRule");
                callback("NG");
            });
            AWS.mock('Lambda', 'invokeAsync', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock Lambda.invokeAsync");
                callback(null, "OK");
            });
        
            let event = {
                Records: [{eventName: "INSERT"}]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

        it("enableRule when data is modified in DB, powerState is changing from offline to online", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'enableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.enableRule");
                callback(null, "OK");
            });
            AWS.mock('Lambda', 'invokeAsync', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock Lambda.invokeAsync");
                callback(null, "OK");
            });
            
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
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
    
        it("disableRule when data is modified in DB, powerState is changing from online to offline", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
            
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
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
    
        it("do nothing when data is modified in DB, powerState is changing from offline to online", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
        
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
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
        
        it("do nothing when data is modified in DB, powerState no change", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
        
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
                                S: "online"
                            }
                        }
                    }
                }]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
        
        it("do nothing when data is modified in DB, no powerState attribute", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
        
            let event = {
                Records: [{
                    eventName: "MODIFY",
                    dynamodb: {
                        NewImage: {
                            positionX: {
                                N: 1
                            }
                        },
                        OldImage: {
                            positionX: {
                                N: 2
                            }
                        }
                    }
                }]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
    
        it("do nothing when data is modified in DB, powerState has different value", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
        
            let event = {
                Records: [{
                    eventName: "MODIFY",
                    dynamodb: {
                        NewImage: {
                            powerState: {
                                S: "neutral"
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
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
        
        it("disableRule when data is removed in DB", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.disableRule");
                callback(null, "OK");
            });
            
            let event = {
                Records: [{eventName: "REMOVE"}]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });
    
        it("disableRule when data is removed in DB, with error CloudWatchEvents", function (done) {
            AWS.restore();
            AWS.mock('CloudWatchEvents', 'disableRule', function(params, callback) {
                winston.log("verbose", "@@@@@@ mock CloudWatchEvents.enableRule");
                callback("NG");
            });
        
            let event = {
                Records: [{eventName: "REMOVE"}]
            };
            let context = {};
            stream_invoke(event, context,  function (err, result) {
                expect(err).equal(null);
                expect(result).equal("done");
                done();
            });
        });

    });

});