let constant = require("../../utils/constant");
let urlRequestValidation = require("../../utils/urlRequestValidation");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;


module.exports.status = function(event, context, callback) {
    winston.log("info", "report status event:", event);
    let dynamoDAO = require("../../database/dynamoDAO");
    let req = urlRequestValidation(event);
    if (req.isValid) {
        winston.log("info", "report status req:", req);
        switch (req.endpoint) {
            case constant.API_ENDPOINT.APP_REPORT:
                dynamoDAO.read(req.nameTag, req.report.showAll).then(function (data) {
                    winston.log("info", "dynamoDAO read data:", data);
                    if (data.hasOwnProperty("positionX") && data.hasOwnProperty("positionY") && data.hasOwnProperty("direction")) {
                        let body = {
                            msg: "Report Robot location:",
                            ntag: data.nameTag,
                            location: {
                                x: data.positionX,
                                y: data.positionY,
                                d: data.direction
                            }
                        };
                        
                        if (data.hasOwnProperty("boardSize") && data.hasOwnProperty("powerState")) {
                            body.boardSize = data.boardSize;
                            body.powerState = data.powerState;
                        }
                        
                        callback(null, {
                            statusCode: 200,
                            body: JSON.stringify(body)
                        });
                        
                    } else {
                        callback(null, {
                            statusCode: 500,
                            body: JSON.stringify({
                                msg: "No Robot found"
                            })
                        });
                    }
                }).catch(function (err) {
                    winston.log("info", "dynamoDAO error:", err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            msg: "No robot data is found."
                        })
                    });
                });
                break;
        }
        
    } else {
        
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                message: "invalid url",
                url: "<base_URL>/<api_endpoint>[?<query_params>]",
                api_endpoint: {
                    report: {
                        query_params: {
                            show: "#optional | all"
                        }
                    }
                }
            }),
        };
        callback(null, response);
    }
};