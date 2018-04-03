const constant = require("./constant");
const dataValidation = require("./dataValidation");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

const REPORT_PARAM_SHOW_ALL = "all";


let urlRequestValidation = function (event) {
    winston.log("verbose", "urlRequestValidation event:", event);
    let result = {
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
    };
    
    try {

        if (event.queryStringParameters !== null) {
            // nameTag
            if (event.queryStringParameters.hasOwnProperty("ntag")) {
                result.nameTag = event.queryStringParameters.ntag;
            }
            
            // board
            if (event.queryStringParameters.hasOwnProperty("bsize")) {
                if (dataValidation.isValidBoard(event.queryStringParameters.bsize)) {
                    result.boardSize = event.queryStringParameters.bsize;
                }
            }
            
            // powerState
            if (event.queryStringParameters.hasOwnProperty("state")) {
                result.powerState = event.queryStringParameters.state;
            }
            
            // positionX, positionY, direction
            if (event.queryStringParameters.hasOwnProperty("place")) {
                if (new RegExp("^[0-9],[0-9],[NSEW]$").test(event.queryStringParameters.place)) {
                    let place = event.queryStringParameters.place.split(",");
                    result.location.positionX = place[0];
                    result.location.positionY = place[1];
                    result.location.direction = place[2];
                }
            }
            
            // report showAll
            if (event.queryStringParameters.hasOwnProperty("show")) {
                result.report.showAll = (event.queryStringParameters.show === REPORT_PARAM_SHOW_ALL);
            }
            
            // action command
            if (event.queryStringParameters.hasOwnProperty("cmd")) {
                result.cmd = event.queryStringParameters.cmd.split(",");
            }
        }
    
        result.endpoint = event.pathParameters.endpoint;
        switch (result.endpoint) {
            case constant.API_ENDPOINT.APP_POWER:
                // api endpoint power validation
                result.isValid = !!(result.powerState === constant.POWER_STATE_VALUE.ONLINE ||
                    result.powerState === constant.POWER_STATE_VALUE.OFFLINE);
                break;
            
            case constant.API_ENDPOINT.APP_START:
                // api endpoint start validation
                result.isValid = dataValidation.isValidLocation(result.boardSize,
                    result.location.positionX, result.location.positionY, result.location.direction);
                break;
            
            case constant.API_ENDPOINT.APP_END:
                // api endpoint end validation
                result.isValid = true;
                break;
            
            case constant.API_ENDPOINT.APP_REPORT:
                // api endpoint report validation
                result.isValid = true;
                break;
    
            case constant.API_ENDPOINT.APP_ACTION:
                // api endpoint action validation
                if (result.cmd.length > 0) {
                    result.isValid = !!result.cmd.reduce(function(a, b){
                        let validCmdA = dataValidation.isValidActionCmd(a);
                        let validCmdB = dataValidation.isValidActionCmd(b);
                        return (validCmdA && validCmdB) ? a : NaN;
                    });
                }
                break;
            
            default:
                break;
        }
        
    } catch (e) {
        // do nothing;
    }
    
    winston.log("verbose", "urlRequestValidation result:", result);
    return result;
};

module.exports = urlRequestValidation;