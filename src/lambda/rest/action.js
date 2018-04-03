let constant = require("../../utils/constant");
let util = require("../../utils/util");
let RobotControl = require("../../logic/RobotControl");
let urlRequestValidation = require("../../utils/urlRequestValidation");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

let robotControl;

module.exports.cmd = function(event, context, callback) {
    winston.log("info", "action cmd event:", event);
    let dynamoDAO = require("../../database/dynamoDAO");
    let req = urlRequestValidation(event);
    if (req.isValid) {
        winston.log("verbose", "action cmd req:", req);
        switch (req.endpoint) {
            
            case constant.API_ENDPOINT.APP_ACTION:
    
                // update action in queue
                dynamoDAO.read(req.nameTag, "all").then(function (robot) {
                    return updateQueue(req.cmd, robot);
                        
                }).catch(function (err) {
                    winston.log("error", "dynamoDAO read error:", err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            msg: "Robot is not started yet, not found."
                        })
                    });
    
                }).then(function (response) {
                    callback(null, {
                        statusCode: 202,
                        body: JSON.stringify({
                            msg: "Robot is executing the cmd >> " + req.cmd,
                            response: response
                        })
                    });
                    
                });
                break;
        }
        
    } else {
        
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                message: "invalid input params",
                url: "<base_URL>/<api_endpoint>[?<query_params>]",
                api_endpoint: {
                    action: {
                        query_params: {
                            cmd: "move | left | right | back"
                        }
                    }
                }
            }),
        };
        callback(null, response);
    }
};

function updateQueue(commands, robot) {
    winston.log("info", "updateQueue commands:", commands, ", robot:", robot);
    
    robotControl = new RobotControl(robot.boardSize, robot.positionX, robot.positionY, robot.direction);
    return new Promise(function (resolve, reject) {
        
        // prepare command execution
        let requestAction = [];
        commands.forEach(function (cmd, i) {
            if (i == 0) {
                requestAction.push(processSqsMsg.bind(null, cmd, robot.nameTag, robot));
            } else {
                requestAction.push(processSqsMsg.bind(null, cmd, robot.nameTag));
            }
        });
    
        // execute command in sequence
        util.runPromiseInSequence(requestAction).then(function (newLocation) {
            winston.log("verbose", "runPromiseInSequence newLocation:", newLocation);
            resolve(newLocation.response);
            
        }).catch(function (err) {
            winston.log("error", "runPromiseInSequence err:", err);
            reject(err);
        });
    });
}

function processSqsMsg(cmd, nameTag, robot) {
    winston.log("verbose", "processSqsMsg cmd:", cmd, ", robot:", robot);
    let currentLocation = {
        positionX: robot.positionX,
        positionY: robot.positionY,
        direction: robot.direction
    };
    
    return new Promise(function(resolve, reject) {
        robotControl.processActionCmd(cmd);
        let newLocation = robotControl.getLocation();
        
        // send msg to sqs
        if (robotControl.isChanged()) {
            winston.log("verbose", "processSqsMsg send msg to sqs, currentLocation:", currentLocation);
            let msg = {
                nameTag: nameTag,
                cmd: cmd,
                current: {
                    positionX: currentLocation.positionX,
                    positionY: currentLocation.positionY,
                    direction: currentLocation.direction
                },
                new: {
                    positionX: newLocation.positionX,
                    positionY: newLocation.positionY,
                    direction: newLocation.direction
                },
                change: newLocation.change
            };
            let sqsTaskManager = require("../../sqs/sqsTaskManager");
            sqsTaskManager.sendMsg(msg).then(function () {
                winston.log("verbose", "sqsTaskManager sendMsg successfully");
                resolve(newLocation);
            }).catch(function (err) {
                winston.log("error", "sqsTaskManager sendMsg error:", err);
                reject(err);
            });

        } else {
            resolve(newLocation);
        }
    });
}
