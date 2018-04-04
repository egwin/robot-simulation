let constant = require("../../utils/constant");
let dataValidation = require("../../utils/dataValidation");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;


function sqsReceiver(context, callback) {
    winston.log("verbose", "ontimeTrigger getRemainingTimeInMillis:", context.getRemainingTimeInMillis());
    if (context.getRemainingTimeInMillis() > 10000) {
        
        // sqs receiver
        let sqsTaskManager = require("../../sqs/sqsTaskManager");
        sqsTaskManager.receiveMsg().then(function (messages) {
            winston.log("verbose", "receiveMsg msg:", messages);
            if (messages !== undefined) {
                return Promise.all(messages.map(update));
                
            } else {
                return "no sqs msg.";
            }
            
        }).catch(function (err) {
            winston.log("error", "receiveMsg error:", err);
            return {};
            
        }).then(function (res) {
            winston.log("verbose", "receiveMsg done, result:", res);
            
            // keep polling in 1min
            winston.log("verbose", "recursive sqsReceiver");
            sqsReceiver(context, callback);
        });
        
    } else {
        callback(null, "done");
    }
}

function update (msg) {
    return new Promise(function (resolve, reject) {
        let robotMsg = JSON.parse(msg.Body);
        winston.log("verbose", "update robotMsg:", robotMsg);
        
        // validate msg scheme
        if (dataValidation.isValidMsgQueueScheme(robotMsg)) {

            let dynamoDAO = require("../../database/dynamoDAO");
            dynamoDAO.read(robotMsg.nameTag, "all").then(function (robot) {
                winston.log("verbose", "dynamoDAO read", robot);
                
                // [1] processing only when powerState is online
                if (robot.powerState === constant.POWER_STATE_VALUE.ONLINE) {
                    
                    // [2] check is correct current location
                    if (robot.positionX === robotMsg.current.positionX &&
                        robot.positionY === robotMsg.current.positionY &&
                        robot.direction === robotMsg.current.direction) {
                        
                        // [3] update db with new change
                        dynamoDAO.update(robotMsg.nameTag,
                            robotMsg.change,
                            robotMsg.new[robotMsg.change]).then(function () {
                            resolve("OK");
                            
                        }).catch(function () {
                            reject("UPDATE DB FAIL");
                            
                        }).then(function () {
                            // [4] delete sqs queue for success db update
                            let sqsTaskManager = require("../../sqs/sqsTaskManager");
                            sqsTaskManager.deleteMsg(msg).catch(function () {
                                // do nothing
                            });
                        });
                        
                    } else {
                        resolve("NG");
                    }
                    
                } else {
                    resolve("OFFLINE");
                }
            });
            
        } else {
            resolve("INVALID");
        }
    });
}

module.exports.trigger = function(event, context, callback) {
    winston.log("info", "ontime trigger event:", event);
    sqsReceiver(context, callback);
};