let constant = require("./constant");


function isValidBoardSize(boardSize) {
    let isValid = false;
    // only supported until 9x9
    if (boardSize.length === 3) {
        let regex = new RegExp("[2-9]x[2-9]");
        isValid = regex.test(boardSize);
    }
    return isValid;
}

function isValidLocation(boardSize, positionX, positionY, direction) {
    let isValid = false;
    if (isValidBoardSize(boardSize)) {
        let positionXLimit = parseInt(boardSize.charAt(0));
        let positionYLimit = parseInt(boardSize.charAt(2));
        isValid = (new RegExp("^[0-"+ positionXLimit + "]{1}$").test(positionX) &&
        new RegExp("^[0-"+ positionYLimit + "]{1}$").test(positionY) &&
        new RegExp("^[NSEW]{1}$").test(direction));
    }
    return isValid;
}

function isValidActionCmd(cmd) {
    let isValid = false;
    if (cmd === constant.ACTION_CMD.MOVE ||
        cmd === constant.ACTION_CMD.LEFT ||
        cmd === constant.ACTION_CMD.RIGHT ||
        cmd === constant.ACTION_CMD.BACK) {
        isValid = true;
    }
    return isValid;
}

function isValidMsgQueueScheme(data) {
    let isValid = false;
    if (data.hasOwnProperty("nameTag") && data.hasOwnProperty("cmd") &&
        data.hasOwnProperty("current") && data.hasOwnProperty("new") &&
        data.hasOwnProperty("change")) {
        if (data.current.hasOwnProperty("positionX") &&
            data.current.hasOwnProperty("positionY") &&
            data.current.hasOwnProperty("direction") &&
            data.new.hasOwnProperty("positionX") &&
            data.new.hasOwnProperty("positionY") &&
            data.new.hasOwnProperty("direction")) {
            isValid = true;
        }
    }
    return isValid;
}

module.exports = {
    isValidBoard: isValidBoardSize,
    isValidLocation: isValidLocation,
    isValidActionCmd: isValidActionCmd,
    isValidMsgQueueScheme: isValidMsgQueueScheme
};