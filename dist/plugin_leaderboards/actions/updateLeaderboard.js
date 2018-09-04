"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReturnCodes_1 = require("../config/ReturnCodes");
const LeaderboardController_1 = require("../controllers/LeaderboardController");
async function updateLeaderboard(command) {
    const result = await LeaderboardController_1.LeaderboardController.updateLeaderboard(command);
    let response;
    switch (result) {
        case ReturnCodes_1.ReturnCodes.INCORRECT_PARAM_LENGTH: {
            response = `No names were provided for the leaderboard`;
            break;
        }
        case ReturnCodes_1.ReturnCodes.LEADERBOARD_NOT_FOUND: {
            response = `A leaderboard with the name ${command.arguments[0]} was not found`;
            break;
        }
        default: {
            response = `Successfully updated leaderboard ${command.arguments[0]}`;
            break;
        }
    }
    return response;
}
exports.updateLeaderboard = updateLeaderboard;
//# sourceMappingURL=updateLeaderboard.js.map