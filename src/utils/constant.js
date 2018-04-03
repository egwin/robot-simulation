/**
 * Default value for robot simulation
  */
const appDefault = {
    NAME_TAG: "robot1",
    BOARD_SIZE: "5x5"
};

const apiEndpoint = {
    APP_POWER: "power",
    APP_START: "start",
    APP_END: "end",
    APP_REPORT: "report",
    APP_ACTION: "action"
};

const attributeName  = {
    ATTR_NAME_TAG: "nameTag",
    ATTR_BOARD_SIZE: "boardSize",
    ATTR_POWER_STATE: "powerState",
    ATTR_POSITION_X: "positionX",
    ATTR_POSITION_Y: "positionY",
    ATTR_DIRECTION: "direction"
};

const powerStateValue = {
    ONLINE: "online",
    OFFLINE: "offline"
};

const directionValue = {
    NORTH: "N",
    SOUTH: "S",
    EAST: "E",
    WEST: "W"
};

const actionCmd = {
    MOVE: "move",
    LEFT: "left",
    RIGHT: "right",
    BACK: "back"
};

module.exports = {
    APP_DEFAULT: appDefault,
    API_ENDPOINT: apiEndpoint,
    DB_ATTR_NAME: attributeName,
    POWER_STATE_VALUE: powerStateValue,
    DIRECTION_VALUE: directionValue,
    ACTION_CMD: actionCmd
};