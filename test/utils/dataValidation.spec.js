let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let dataValidation = require("../../src/utils/dataValidation");

describe("dataValidation", function() {
    
    describe("test for \"isValidBoard\" function", function() {
        it("return true for correct board size", function() {
            expect(dataValidation.isValidBoard("5x5")).equal(true);
            expect(dataValidation.isValidBoard("9x9")).equal(true);
            expect(dataValidation.isValidBoard("2x5")).equal(true);
            expect(dataValidation.isValidBoard("2x9")).equal(true);
            expect(dataValidation.isValidBoard("2x2")).equal(true);
        });
    
        it("return false for incorrect board size", function() {
            expect(dataValidation.isValidBoard("1x5")).equal(false);
            expect(dataValidation.isValidBoard("5X5")).equal(false);
            expect(dataValidation.isValidBoard("10x10")).equal(false);
            expect(dataValidation.isValidBoard("5")).equal(false);
            expect(dataValidation.isValidBoard("2x0")).equal(false);
        });
    });
    
    describe("test for \"isValidLocation\" function", function() {
        it("return true for correct location inside the board size", function() {
            expect(dataValidation.isValidLocation("5x5", 0, 0, "N")).equal(true);
            expect(dataValidation.isValidLocation("9x9", 0, 9, "S")).equal(true);
            expect(dataValidation.isValidLocation("2x5", 1, 1, "E")).equal(true);
            expect(dataValidation.isValidLocation("2x9", 2, 9, "W")).equal(true);
            expect(dataValidation.isValidLocation("2x2", 2, 2, "N")).equal(true);
        });
    
        it("return false for incorrect location outside of board size", function() {
            expect(dataValidation.isValidLocation("5x5", 0, 0, "NS")).equal(false);
            expect(dataValidation.isValidLocation("9X9", 10, 0, "E")).equal(false);
            expect(dataValidation.isValidLocation("2x5", 3, 3, "N")).equal(false);
            expect(dataValidation.isValidLocation("2x9", 0, -1, "N")).equal(false);
            expect(dataValidation.isValidLocation("1x9", 0, 0, "N")).equal(false);
        });
    });
    
    describe("test for \"isValidActionCmd\" function", function() {
        it("return true for correct action command", function() {
            expect(dataValidation.isValidActionCmd("move")).equal(true);
            expect(dataValidation.isValidActionCmd("left")).equal(true);
            expect(dataValidation.isValidActionCmd("right")).equal(true);
            expect(dataValidation.isValidActionCmd("back")).equal(true);
        });
    
        it("return false for incorrect action command", function() {
            expect(dataValidation.isValidActionCmd("MOVE")).equal(false);
            expect(dataValidation.isValidActionCmd("up")).equal(false);
            expect(dataValidation.isValidActionCmd("m")).equal(false);
        });
    });
    
    describe("test for \"isValidMsgQueueScheme\" function", function() {
        it("return true for correct format", function() {
            let msg = {
                nameTag: "robot1",
                cmd: "back",
                current: {
                    positionX: 0,
                    positionY: 3,
                    direction: "N"
                },
                new: {
                    positionX: 0,
                    positionY: 2,
                    direction: "N"
                },
                change: "positionY"
            };
            expect(dataValidation.isValidMsgQueueScheme(msg)).to.deep.equal(true);
        });
        
        it("return false for wrong format", function() {
            let msg = {
                nameTag: "robot1",
                cmd: "back",
                current: {
                    positionX: 0,
                    positionY: 3
                },
                new: {
                    positionX: 0,
                    positionY: 2
                },
                change: "positionY"
            };
            expect(dataValidation.isValidMsgQueueScheme(msg)).to.deep.equal(false);
            
            msg = {
                nameTag: "robot1",
                cmd: "back",
                current: {
                    positionX: 0,
                    positionY: 3,
                    direction: "N"
                },
                change: "positionY"
            };
            expect(dataValidation.isValidMsgQueueScheme(msg)).to.deep.equal(false);
        });
    });
});