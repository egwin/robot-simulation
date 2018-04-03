const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const winston = require("winston");
winston.level = process.env.LOG_LEVEL;


let dynamoDAO = (function () {
    return {
       
        create: function(nameTag, boardSize, positionX, positionY, direction) {
            const params = {
                TableName: process.env.DB_TABLE,
                Item: {
                    nameTag: nameTag,
                    powerState: "online",
                    boardSize: boardSize,
                    positionX: positionX,
                    positionY: positionY,
                    direction: direction
                },
                ConditionExpression: "(direction <> :north OR direction <> :south OR direction <> :east OR direction <> :west)",
                ExpressionAttributeValues: {
                    ":north": {"S": "N"},
                    ":south": {"S": "S"},
                    ":east": {"S": "E"},
                    ":west": {"S": "W"}
                }
            };
            
            return new Promise(function(resolve, reject) {
                // write to the database
                dynamoDb.put(params, function(error) {
                    if (error) {
                        winston.log("error", "dynamoDAO create, put error", error);
                        // handle potential errors
                        return reject("NG");
                    } else {
                        winston.log("verbose", "dynamoDAO create, put successfully");
                        return resolve("OK")
                    }
                });
            });
        },
        
        read: function (nameTag, showAll) {
    
            let pExpression = ["positionX", "positionY", "direction"];
            if (showAll) {
                pExpression.push(["nameTag"]);
                pExpression.push(["boardSize"]);
                pExpression.push(["powerState"]);
            }
            
            const params = {
                TableName: process.env.DB_TABLE,
                Key: {
                    nameTag: nameTag
                },
                ConsistentRead: true,
                ProjectionExpression: pExpression
            };
    
            return new Promise(function(resolve, reject) {
                // fetch from the database
                dynamoDb.get(params, function(error, result) {
                    if (error) {
                        winston.log("error", "dynamoDAO read, get error", error);
                        // handle potential errors
                        return reject("NG");
                    } else {
                        winston.log("verbose", "dynamoDAO read, get successfully item:", result.Item);
                        return resolve(result.Item)
                    }
                });
            });
        },
        
        update: function (nameTag, type, value) {
            const params = {
                TableName: process.env.DB_TABLE,
                Key: {
                    nameTag: nameTag,
                },
                ExpressionAttributeNames: {
                    "#type": type,
                },
                ExpressionAttributeValues: {
                    ":value": value
                },
                UpdateExpression: "SET #type = :value",
                ConditionExpression: "attribute_exists(powerState) AND attribute_exists(boardSize)",
                ReturnValues: "UPDATED_NEW",
            };
    
            return new Promise(function(resolve, reject) {
                // update in the database
                dynamoDb.update(params, function(error) {
                    if (error) {
                        winston.log("error", "dynamoDAO update error", error);
                        // handle potential errors
                        return reject(error);
                    } else {
                        winston.log("verbose", "dynamoDAO update successfully");
                        return resolve("OK")
                    }
                });
            });
        },
        
        delete: function (nameTag) {
            const params = {
                TableName: process.env.DB_TABLE,
                Key: {
                    nameTag: nameTag,
                }
            };
    
            return new Promise(function(resolve, reject) {
                // update in the database
                dynamoDb.delete(params, function(error) {
                    if (error) {
                        winston.log("error", "dynamoDAO delete error", error);
                        // handle potential errors
                        return reject("NG");
                    } else {
                        winston.log("verbose", "dynamoDAO delete successfully");
                        return resolve("OK")
                    }
                });
            });
        }
        
    }
}());

module.exports = dynamoDAO;