"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../core/logger");
const errorCodes_1 = require("../config/errorCodes");
const LeaderboardDAO_1 = require("../dao/LeaderboardDAO");
const ColumnDAO_1 = require("../dao/ColumnDAO");
const RowDAO_1 = require("../dao/RowDAO");
const ValueDAO_1 = require("../dao/ValueDAO");
var ValueController;
(function (ValueController) {
    async function upsertValue(command) {
        if (command.arguments.length != 4) {
            logger_1.default.warn("LDBD_BAD_PARAM: Incorrect number of parameters provided");
            return errorCodes_1.ErrorCodes.LDBD_BAD_PARAM;
        }
        const leaderboardName = command.arguments[0];
        const existingLeaderboards = await LeaderboardDAO_1.LeaderboardDAO.getLeaderboard(leaderboardName);
        if (existingLeaderboards.length === 0) {
            logger_1.default.warn("LDBD_NOT_FOUND: No leaderboard found for query");
            return errorCodes_1.ErrorCodes.LDBD_NOT_FOUND;
        }
        let leaderboard = existingLeaderboards[0];
        const columnName = command.arguments[1];
        let existingColumns = await ColumnDAO_1.ColumnDAO.getLeaderboardColumn(leaderboard.id, columnName);
        if (existingColumns.length === 0) {
            logger_1.default.warn("LDBD_COL_NOT_FOUND: No leaderboard column found for query");
            return errorCodes_1.ErrorCodes.LDBD_COL_NOT_FOUND;
        }
        let column = existingColumns[0];
        const rowName = command.arguments[2];
        let existingRows = await RowDAO_1.RowDAO.getLeaderboardRow(leaderboard.id, rowName);
        if (existingRows.length === 0) {
            logger_1.default.warn("LDBD_ROW_NOT_FOUND: NO leaderboard row found for query");
            return errorCodes_1.ErrorCodes.LDBD_ROW_NOT_FOUND;
        }
        let row = existingRows[0];
        let value = command.arguments[3];
        await ValueDAO_1.ValueDAO.upsertValue(column.id, row.id, value);
        logger_1.default.info(`Upserted leaderboard value ${value} in column ${columnName} and row ${rowName}`);
    }
    ValueController.upsertValue = upsertValue;
})(ValueController = exports.ValueController || (exports.ValueController = {}));
//# sourceMappingURL=ValueController.js.map