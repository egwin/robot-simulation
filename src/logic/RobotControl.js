let constant = require("../utils/constant");
let dataValidation = require("../utils/dataValidation");
let location = undefined;
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

function RobotControl(boardSize, positionX, positionY, direction) {
    winston.log("info", "RobotControl", boardSize, positionX, positionY, direction);
    location = {
        boardSize: boardSize,
        positionX: positionX,
        positionY: positionY,
        direction: direction,
        change: undefined,
        response: []
    };
}

RobotControl.prototype.processActionCmd = function (cmd) {
    winston.log("verbose", "RobotControl processActionCmd:", cmd);
    let newLocation = {
        positionX: location.positionX,
        positionY: location.positionY,
        direction: location.direction,
        change: undefined
    };
    
    switch (cmd) {
        case constant.ACTION_CMD.MOVE:
            if (location.direction === constant.DIRECTION_VALUE.EAST) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX+1, location.positionY, location.direction)) {
                    newLocation.positionX +=1;
                    newLocation.change = "positionX";
                }
            } else if (location.direction === constant.DIRECTION_VALUE.SOUTH) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX, location.positionY-1, location.direction)) {
                    newLocation.positionY -=1;
                    newLocation.change = "positionY";
                }
                
            } else if (location.direction === constant.DIRECTION_VALUE.WEST) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX-1, location.positionY, location.direction)) {
                    newLocation.positionX -=1;
                    newLocation.change = "positionX";
                }
                
            } else if (location.direction === constant.DIRECTION_VALUE.NORTH) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX, location.positionY+1, location.direction)) {
                    newLocation.positionY +=1;
                    newLocation.change = "positionY";
                }
            }
            break;
        
        case constant.ACTION_CMD.LEFT:
            if (location.direction === constant.DIRECTION_VALUE.EAST) {
                newLocation.direction = constant.DIRECTION_VALUE.NORTH;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.SOUTH) {
                newLocation.direction = constant.DIRECTION_VALUE.EAST;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.WEST) {
                newLocation.direction = constant.DIRECTION_VALUE.SOUTH;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.NORTH) {
                newLocation.direction = constant.DIRECTION_VALUE.WEST;
                newLocation.change = "direction";
            }
            break;
        
        case constant.ACTION_CMD.RIGHT:
            if (location.direction === constant.DIRECTION_VALUE.EAST) {
                newLocation.direction = constant.DIRECTION_VALUE.SOUTH;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.SOUTH) {
                newLocation.direction = constant.DIRECTION_VALUE.WEST;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.WEST) {
                newLocation.direction = constant.DIRECTION_VALUE.NORTH;
                newLocation.change = "direction";
                
            } else if (location.direction === constant.DIRECTION_VALUE.NORTH) {
                newLocation.direction = constant.DIRECTION_VALUE.EAST;
                newLocation.change = "direction";
            }
            break;
        
        case constant.ACTION_CMD.BACK:
            if (location.direction === constant.DIRECTION_VALUE.EAST) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX-1, location.positionY, location.direction)) {
                    newLocation.positionX -=1;
                    newLocation.change = "positionX";
                }
            } else if (location.direction === constant.DIRECTION_VALUE.SOUTH) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX, location.positionY+1, location.direction)) {
                    newLocation.positionY +=1;
                    newLocation.change = "positionY";
                }
                
            } else if (location.direction === constant.DIRECTION_VALUE.WEST) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX+1, location.positionY, location.direction)) {
                    newLocation.positionX +=1;
                    newLocation.change = "positionX";
                }
                
            } else if (location.direction === constant.DIRECTION_VALUE.NORTH) {
                if (dataValidation.isValidLocation(location.boardSize, location.positionX, location.positionY-1, location.direction)) {
                    newLocation.positionY -=1;
                    newLocation.change = "positionY";
                }
            }
            break;
    }
    
    // update location
    location.positionX = newLocation.positionX;
    location.positionY = newLocation.positionY;
    location.direction = newLocation.direction;
    location.change = newLocation.change;
    location.response.push(newLocation.change !== undefined ? "OK" : "NG");
};

RobotControl.prototype.getLocation = function () {
    winston.log("verbose", "RobotControl getLocation:", location);
  return location;
};

RobotControl.prototype.isChanged = function () {
    return location.change !== undefined;
};


module.exports = RobotControl;