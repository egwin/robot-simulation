let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let urlRequestValidation = require("../../src/utils/urlRequestValidation");
let constant = require("../../src/utils/constant");

describe("urlRequestValidation", function() {
    
    describe("test for \"urlRequestValidation\" function", function() {
        it("get the correct result from url parsing", function() {
            // test endpoint power
            let event = {
                pathParameters: {
                    endpoint: "power"
                },
                queryStringParameters: {
                    state: "offline"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: true,
                nameTag: constant.APP_DEFAULT.NAME_TAG,
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.OFFLINE,
                endpoint: constant.API_ENDPOINT.APP_POWER,
                location: {
                    positionX: -1,
                    positionY: -1,
                    direction: undefined
                },
                report: {
                    showAll: false
                },
                cmd: []
            });
    
            // test endpoint start
            event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: {
                    ntag: "robot2",
                    bsize: "8x8",
                    place: "1,2,N"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: true,
                nameTag: "robot2",
                boardSize: "8x8",
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_START,
                location: {
                    positionX: "1",
                    positionY: "2",
                    direction: "N"
                },
                report: {
                    showAll: false
                },
                cmd: []
            });
    
            // test endpoint end
            event = {
                pathParameters: {
                    endpoint: "end"
                },
                queryStringParameters: {
                    ntag: "robot2"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: true,
                nameTag: "robot2",
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_END,
                location: {
                    positionX: -1,
                    positionY: -1,
                    direction: undefined
                },
                report: {
                    showAll: false
                },
                cmd: []
            });
    
            // test endpoint report
            event = {
                pathParameters: {
                    endpoint: "report"
                },
                queryStringParameters: {
                    ntag: "robot2",
                    show: "all"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: true,
                nameTag: "robot2",
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_REPORT,
                location: {
                    positionX: -1,
                    positionY: -1,
                    direction: undefined
                },
                report: {
                    showAll: true
                },
                cmd: []
            });
    
            // test endpoint action
            event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: {
                    cmd: "left,right"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: true,
                nameTag: constant.APP_DEFAULT.NAME_TAG,
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_ACTION,
                location: {
                    positionX: -1,
                    positionY: -1,
                    direction: undefined
                },
                report: {
                    showAll: false
                },
                cmd: ["left", "right"]
            });
    
            // test endpoint xxx (non-exist)
            event = {
                pathParameters: {
                    endpoint: "xxx"
                },
                queryStringParameters: {
                    cmd: "left,right"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: false,
                nameTag: constant.APP_DEFAULT.NAME_TAG,
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: "xxx",
                location: {
                    positionX: -1,
                    positionY: -1,
                    direction: undefined
                },
                report: {
                    showAll: false
                },
                cmd: ["left", "right"]
            });
        });
    });

});