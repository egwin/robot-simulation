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

    describe("test for RobotControl action process", function() {
        it("return new value corresponding with action", function() {
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

            // [move -2] (At South)
            robotControl = new RobotControl("5x5", 3, 3, "S");
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

            // [move -3] (At West)
            robotControl = new RobotControl("5x5", 3, 3, "W");
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

            // [move -4] (At North)
            robotControl = new RobotControl("5x5", 3, 3, "N");
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

            // [left -1] (At East)
            robotControl = new RobotControl("5x5", 3, 3, "E");
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

            // [left -2] (At North)
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "W",
                change: "direction",
                response: ["OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [left -3] (At West)
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "S",
                change: "direction",
                response: ["OK", "OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [left -4] (At South)
            robotControl.processActionCmd("left");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "E",
                change: "direction",
                response: ["OK", "OK", "OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [right -1] (At East)
            robotControl = new RobotControl("5x5", 3, 3, "E");
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

            // [right -2] (At North)
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "W",
                change: "direction",
                response: ["OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [right -3] (At West)
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "N",
                change: "direction",
                response: ["OK", "OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [right -4] (At South)
            robotControl.processActionCmd("right");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 3,
                positionY: 3,
                direction: "E",
                change: "direction",
                response: ["OK", "OK", "OK", "OK"]
            });
            expect(robotControl.isChanged()).equal(true);

            // [back -1] (At East)
            robotControl = new RobotControl("5x5", 3, 3, "E");
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

            // [back -2] (At South)
            robotControl = new RobotControl("5x5", 3, 3, "S");
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

            // [back -3] (At West)
            robotControl = new RobotControl("5x5", 3, 3, "W");
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

            // [back -4] (At North)
            robotControl = new RobotControl("5x5", 3, 3, "N");
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

            // [no change]
            robotControl = new RobotControl("5x5", 5, 5, "E");
            robotControl.processActionCmd("move");
            expect(robotControl.getLocation()).to.deep.equal({
                boardSize: "5x5",
                positionX: 5,
                positionY: 5,
                direction: "E",
                change: undefined,
                response: ["NG"]
            });
            expect(robotControl.isChanged()).equal(false);
        });
    });
    
});