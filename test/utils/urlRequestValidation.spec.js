let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let urlRequestValidation = require("../../src/utils/urlRequestValidation");
let constant = require("../../src/utils/constant");

describe("urlRequestValidation", function() {
    
    describe("test for endpoint app", function() {
        
        it("app power url parsing", function () {
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
        });
    
        it("app start url parsing", function () {
            // test endpoint start
            let event = {
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
        });
    
        it("app start url parsing, with invalid board size and place", function () {
            // test endpoint start
            let event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: {
                    ntag: "robot2",
                    bsize: "10x8",
                    place: "10,2,N"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: false,
                nameTag: "robot2",
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_START,
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
        });
        
        it("app start url parsing, with null query params", function () {
            // test endpoint end
            let event = {
                pathParameters: {
                    endpoint: "start"
                },
                queryStringParameters: null
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: false,
                nameTag: "robot1",
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: constant.API_ENDPOINT.APP_START,
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
        });
        
        it("app end url parsing", function () {
            // test endpoint end
            let event = {
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
        });
    
    });
    
    describe("test for endpoint report", function() {
    
        it("report url parsing", function () {
            // test endpoint report
            let event = {
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
        });
    
        it("report url parsing, with no query params", function () {
            // test endpoint report
            let event = {
                pathParameters: {
                    endpoint: "report"
                }
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: false,
                nameTag: constant.APP_DEFAULT.NAME_TAG,
                boardSize: constant.APP_DEFAULT.BOARD_SIZE,
                powerState: constant.POWER_STATE_VALUE.ONLINE,
                endpoint: undefined,
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
        });
    });
    
    describe("test for endpoint action", function() {
    
        it("action url parsing", function () {
            // test endpoint action
            let event = {
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
        });
    
        it("action url parsing, with null query params", function () {
            // test endpoint action
            let event = {
                pathParameters: {
                    endpoint: "action"
                },
                queryStringParameters: null
            };
            expect(urlRequestValidation(event)).to.deep.equal({
                isValid: false,
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
                cmd: []
            });
        });
        
        it("wrong endpoint url", function () {
            // test endpoint xxx (non-exist)
            let event = {
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