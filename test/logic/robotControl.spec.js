let describe = require("mocha").describe;
let it = require("mocha").it;
let expect = require("chai").expect;
let RobotControl = require("../../src/logic/RobotControl");

describe("RobotControl", function() {
    
    describe("test for RobotControl init state", function() {
        
        it("return init value", function() {
            let robotControl = new RobotControl("5x5", 3, 3, "S");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "S",
                change: undefined,
                response: []
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
    });

    describe("test for RobotControl action MOVE", function() {
        
        it("return new value corresponding with valid move action at EAST", function () {
            // [move -1] (At East)
            let robotControl = new RobotControl("5x5", 3, 3, "E");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 4,
                positionY: 3,
                direction: "E",
                change: "positionX",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with invalid move action at EAST", function () {
            // [move -1] (At East)
            let robotControl = new RobotControl("5x5", 5, 0, "E");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 5,
                positionY: 0,
                direction: "E",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    
        it("return new value corresponding with valid move action at SOUTH", function () {
            // [move -2] (At South)
            let robotControl = new RobotControl("5x5", 3, 3, "S");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 2,
                direction: "S",
                change: "positionY",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with invalid move action at SOUTH", function () {
            // [move -2] (At South)
            let robotControl = new RobotControl("5x5", 3, 0, "S");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 0,
                direction: "S",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    
        it("return new value corresponding with valid move action at WEST", function () {
            // [move -3] (At West)
            let robotControl = new RobotControl("5x5", 3, 3, "W");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 2,
                positionY: 3,
                direction: "W",
                change: "positionX",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with invalid move action at WEST", function () {
            // [move -3] (At West)
            let robotControl = new RobotControl("5x5", 0, 3, "W");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 0,
                positionY: 3,
                direction: "W",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    
        it("return new value corresponding with valid move action at NORTH", function () {
            // [move -4] (At North)
            let robotControl = new RobotControl("5x5", 3, 3, "N");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 4,
                direction: "N",
                change: "positionY",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with invalid move action at NORTH", function () {
            // [move -4] (At North)
            let robotControl = new RobotControl("5x5", 3, 5, "N");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 5,
                direction: "N",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    
        it("return same value corresponding with wrong direction", function () {
            // [move -5] (At T)
            let robotControl = new RobotControl("5x5", 3, 5, "T");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 5,
                direction: "T",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
    });
    
    describe("test for RobotControl action LEFT", function() {
    
        it("return new value corresponding with left action at EAST", function () {
            // [left -1] (At East)
            let robotControl = new RobotControl("5x5", 3, 3, "E");
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "N",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with left action at NORTH", function () {
            // [left -2] (At North)
            let robotControl = new RobotControl("5x5", 3, 3, "N");
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "W",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with left action at WEST", function () {
            // [left -3] (At West)
            let robotControl = new RobotControl("5x5", 3, 3, "W");
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "S",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with left action at SOUTH", function () {
            // [left -4] (At South)
            let robotControl = new RobotControl("5x5", 3, 3, "S");
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "E",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with wrong direction", function () {
            // [left -5] (At T)
            let robotControl = new RobotControl("5x5", 3, 5, "T");
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 5,
                direction: "T",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    
    });
    
    describe("test for RobotControl action RIGHT", function() {
    
        it("return new value corresponding with right action at EAST", function () {
            // [right -1] (At East)
            let robotControl = new RobotControl("5x5", 3, 3, "E");
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "S",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with right action at NORTH", function () {
            // [right -2] (At North)
            let robotControl = new RobotControl("5x5", 3, 3, "N");
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "E",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with right action at WEST", function () {
            // [right -3] (At West)
            let robotControl = new RobotControl("5x5", 3, 3, "W");
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "N",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return new value corresponding with right action at SOUTH", function () {
            // [right -4] (At South)
            let robotControl = new RobotControl("5x5", 3, 3, "S");
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "W",
                change: "direction",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
    
        it("return same value corresponding with wrong direction", function () {
            // [left -5] (At T)
            let robotControl = new RobotControl("5x5", 3, 5, "T");
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 5,
                direction: "T",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
    });
    
    describe("test for RobotControl action BACK", function() {
        
        it("return new value corresponding with valid back action at EAST", function () {
            // [back -1] (At East)
            let robotControl = new RobotControl("5x5", 3, 3, "E");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 2,
                positionY: 3,
                direction: "E",
                change: "positionX",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
        
        it("return same value corresponding with invalid back action at EAST", function () {
            // [back -1] (At East)
            let robotControl = new RobotControl("5x5", 0, 5, "E");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 0,
                positionY: 5,
                direction: "E",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
        it("return new value corresponding with valid back action at SOUTH", function () {
            // [back -2] (At South)
            let robotControl = new RobotControl("5x5", 3, 3, "S");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 4,
                direction: "S",
                change: "positionY",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
        
        it("return same value corresponding with invalid back action at SOUTH", function () {
            // [back -2] (At South)
            let robotControl = new RobotControl("5x5", 0, 5, "S");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 0,
                positionY: 5,
                direction: "S",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
        it("return new value corresponding with valid back action at WEST", function () {
            // [back -3] (At West)
            let robotControl = new RobotControl("5x5", 3, 3, "W");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 4,
                positionY: 3,
                direction: "W",
                change: "positionX",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
        
        it("return same value corresponding with invalid back action at WEST", function () {
            // [back -3] (At West)
            let robotControl = new RobotControl("5x5", 5, 0, "W");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 5,
                positionY: 0,
                direction: "W",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
        it("return new value corresponding with valid back action at NORTH", function () {
            // [back -4] (At North)
            let robotControl = new RobotControl("5x5", 3, 3, "N");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 2,
                direction: "N",
                change: "positionY",
                response: ["OK"]
            });
            expect(robotControl.isChanged()).equal(true);
        });
        
        it("return same value corresponding with invalid back action at NORTH", function () {
            // [back -4] (At North)
            let robotControl = new RobotControl("5x5", 5, 0, "N");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 5,
                positionY: 0,
                direction: "N",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
        it("return same value corresponding with wrong direction", function () {
            // [back -5] (At T)
            let robotControl = new RobotControl("5x5", 3, 5, "T");
            robotControl.processActionCmd("back");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 5,
                direction: "T",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
        
    });
    
});