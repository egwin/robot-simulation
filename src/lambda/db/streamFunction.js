const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
let attr = require("dynamodb-data-types").AttributeValue;
let constant = require("../../utils/constant");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;


function alarmAction(enable) {
    winston.log("info", "alarmAction", process.env.EVENT_ALARM, enable);
    let cwevents = new AWS.CloudWatchEvents();
    if (enable) {
        cwevents.enableRule({Name: process.env.EVENT_ALARM}, function(err, data) {
            if (err) {
                winston.log("error", "enableRule Error", err.stack);
            } else {
                winston.log("verbose", "enableRule Success", data);
            }
        });
        
    } else {
        cwevents.disableRule({Name: process.env.EVENT_ALARM}, function(err, data) {
            if (err) {
                winston.log("error", "disableRule Error", err.stack);
            } else {
                winston.log("verbose", "disableRule Success", data);
            }
        });
    }
}


module.exports.invoke = function(event, context, callback) {
    winston.log("info", "streamFunction invoke", event.Records[0].eventName);
    
    switch (event.Records[0].eventName) {
        case "INSERT":
            alarmAction(true);
            break;

        case "MODIFY":
            let newImage = attr.unwrap(event.Records[0].dynamodb.NewImage);
            winston.log("verbose", "newImage", newImage);
            let oldImage = attr.unwrap(event.Records[0].dynamodb.OldImage);
            winston.log("verbose", "oldImage", oldImage);
            
            if (newImage.hasOwnProperty(constant.DB_ATTR_NAME.ATTR_POWER_STATE) &&
                oldImage.hasOwnProperty(constant.DB_ATTR_NAME.ATTR_POWER_STATE)) {
                if (newImage.powerState !== oldImage.powerState) {
                    if (newImage.powerState === constant.POWER_STATE_VALUE.ONLINE) {
                        alarmAction(true);
                    } else if (newImage.powerState === constant.POWER_STATE_VALUE.OFFLINE) {
                        alarmAction(false);
                    }
                }
            }
            break;

        case "REMOVE":
            alarmAction(false);
            break;
    }

    callback(null, "done");
};
