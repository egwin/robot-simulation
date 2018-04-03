let constant = require("../../utils/constant");
let urlRequestValidation = require("../../utils/urlRequestValidation");
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;

module.exports.state = function(event, context, callback) {
    winston.log("info", "app state event:", event);
    let dynamoDAO = require("../../database/dynamoDAO");
    let req = urlRequestValidation(event);
    if (req.isValid) {
        winston.log("verbose", "app state req:", req);
        switch (req.endpoint) {
    
            case constant.API_ENDPOINT.APP_START:
                dynamoDAO.create(req.nameTag,
                                req.boardSize,
                                parseInt(req.location.positionX),
                                parseInt(req.location.positionY),
                                req.location.direction).then(function(data) {
                    
                    winston.log("verbose", "dynamoDAO create data:", data);
                    callback(null, {
                        statusCode: 201,
                        body: JSON.stringify({
                            msg: "Robot is started at x=" + req.location.positionX +
                            ", y=" + req.location.positionY + ", d=" + req.location.direction,
                            response: data
                        })
                    });
                }).catch(function (err) {
                    winston.log("error", "dynamoDAO create error:", err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            msg: "Server error to start the robot"
                        })
                    });
                });
                break;
    
            case constant.API_ENDPOINT.APP_POWER:
                dynamoDAO.update(req.nameTag, "powerState", req.powerState).then(function (data) {
                    winston.log("verbose", "dynamoDAO update data:", data);
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify({
                            msg: "Robot connection is changed, power state:" + req.powerState,
                            response: data
                        })
                    });
                }).catch(function (err) {
                    winston.log("error", "dynamoDAO update error:", err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            msg: "Server error cannot update power state"
                        })
                    });
                });
                break;

            case constant.API_ENDPOINT.APP_END:
                dynamoDAO.delete(req.nameTag).then(function (data) {
                    winston.log("verbose", "dynamoDAO delete data:", data);
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify({
                            msg: "Robot is terminated",
                            response: data
                        })
                    });
                }).catch(function (err) {
                    winston.log("error", "dynamoDAO delete error:", err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            msg: "Server error cannot terminate Robot"
                        })
                    });
                });
                break;
        }
        
    } else {
    
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                msg: "invalid input params",
                url: "<base_URL>/<api_endpoint>[?<query_params>]",
                api_endpoint: {
                    power: {
                        query_params: {
                            state: "online | offline"
                        }
                    },
                    start: {
                        query_params: {
                            nametag: "#optional | 'any chars or number' [eg:robot1]",
                            boardsize: "optional | 'size x size' [1 < size < 10, eg:5x5]",
                            place: "'x,y,direction' [eg: 1,1,W]"
                        }
                    },
                    end: {
                        query_params: {
                            nametag: "#optional | 'any chars or number' [eg:robot1]"
                        }
                    }
                }
            }),
        };
        callback(null, response);
    }

};

