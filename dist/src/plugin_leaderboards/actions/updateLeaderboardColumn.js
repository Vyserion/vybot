"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = require("../config/errorCodes");
const controller_1 = require("../controller");
const updateLeaderboardColumn = async (command, message) => {
    let result = await controller_1.LeaderboardController.updateLeaderboardColumn(command);
    let response;
    switch (result) {
        case errorCodes_1.ErrorCodes.LDBD_BAD_PARAM: {
            if (command.arguments.length < 4) {
                response = 'Not enough parameters provided - please check you have a Leaderboard Name, Column Name, Action, and value.';
            }
            else {
                response = 'Too many arguments were provided';
            }
            break;
        }
        case errorCodes_1.ErrorCodes.LDBD_NOT_FOUND: {
            response = 'A leaderboard with the name ' + command.arguments[0] + ' was not found';
            break;
        }
        case errorCodes_1.ErrorCodes.LDBD_COL_NOT_FOUND: {
            response = 'A leaderboard with the column ' + command.arguments[1] + ' was not found';
            break;
        }
        case errorCodes_1.ErrorCodes.LDBD_INVALID_PARAM: {
            response = 'The action ' + command.arguments[2] + ' cannot be performed on this column';
            break;
        }
        default: {
            response = 'Succesfully updated the leaderboard column ' + command.arguments[2];
            break;
        }
    }
    message.channel.send(response);
};
exports.default = updateLeaderboardColumn;
//# sourceMappingURL=updateLeaderboardColumn.js.map