"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LeaderboardDAO_1 = require("../dao/LeaderboardDAO");
const ColumnDAO_1 = require("../dao/ColumnDAO");
const Leaderboard_1 = require("../models/Leaderboard");
const logger_1 = require("../../core/logger");
const errorCodes_1 = require("../config/errorCodes");
const Column_1 = require("../models/Column");
const RowDAO_1 = require("../dao/RowDAO");
const Row_1 = require("../models/Row");
const ValueDAO_1 = require("../dao/ValueDAO");
var LeaderboardController;
(function (LeaderboardController) {
    async function getLeaderboards() {
        return await LeaderboardDAO_1.LeaderboardDAO.getLeaderboards();
    }
    LeaderboardController.getLeaderboards = getLeaderboards;
    async function getLeaderboard(command) {
        if (command.arguments.length != 1) {
            logger_1.default.warn("LDBD_BAD_PARAM: Incorrect number of parameters provided");
            return errorCodes_1.ErrorCodes.LDBD_BAD_PARAM;
        }
        const leaderboardName = command.arguments[0];
        let existingLeaderboards = await LeaderboardDAO_1.LeaderboardDAO.getLeaderboard(leaderboardName);
        if (existingLeaderboards.length == 0) {
            logger_1.default.warn("LDBD_NOT_FOUND: No leaderboard found for query");
            return errorCodes_1.ErrorCodes.LDBD_NOT_FOUND;
        }
        let leaderboard = existingLeaderboards[0];
        let columns = await ColumnDAO_1.ColumnDAO.getLeaderboardColumns(leaderboard.id);
        let rows = await RowDAO_1.RowDAO.getLeaderboardRows(leaderboard.id);
        let leaderboardObj = new Leaderboard_1.default();
        leaderboardObj.name = leaderboard.name;
        for (let column of columns) {
            let col = new Column_1.default(column.name, column.type);
            leaderboardObj.columns.push(col);
        }
        for (let row of rows) {
            let r = new Row_1.default(row.name);
            leaderboardObj.rows.push(r);
        }
        return leaderboardObj;
    }
    LeaderboardController.getLeaderboard = getLeaderboard;
    async function insertLeaderboard(command) {
        if (command.arguments.length != 1) {
            logger_1.default.warn("LDBD_BAD_PARAM: Incorrect number of parameters provided");
            return errorCodes_1.ErrorCodes.LDBD_BAD_PARAM;
        }
        const name = command.arguments[0];
        let existingLeaderboards = await LeaderboardDAO_1.LeaderboardDAO.getLeaderboard(name);
        if (existingLeaderboards.length > 0) {
            logger_1.default.warn("LDBD_DUP_NAME: A leaderboard with that name already exists");
            return errorCodes_1.ErrorCodes.LDBD_DUP_NAME;
        }
        await LeaderboardDAO_1.LeaderboardDAO.insertLeaderboard(name);
        logger_1.default.info("Created new leaderboard " + name);
        return true;
    }
    LeaderboardController.insertLeaderboard = insertLeaderboard;
    async function updateLeaderboard(command) {
        if (command.arguments.length != 2) {
            logger_1.default.warn("LDBD_BAD_PARAM: Incorrect number of parameters provided");
            return errorCodes_1.ErrorCodes.LDBD_BAD_PARAM;
        }
        const name = command.arguments[0];
        const newName = command.arguments[1];
        let existingLeaderboards = await LeaderboardDAO_1.LeaderboardDAO.getLeaderboard(name);
        if (existingLeaderboards.length == 0) {
            logger_1.default.warn("LDBD_NOT_FOUND: No leaderboard found for query");
            return errorCodes_1.ErrorCodes.LDBD_NOT_FOUND;
        }
        const id = existingLeaderboards[0].id;
        await LeaderboardDAO_1.LeaderboardDAO.updateLeaderboard(id, newName);
        logger_1.default.info("Updated leaderboard " + name + " to " + newName);
        return true;
    }
    LeaderboardController.updateLeaderboard = updateLeaderboard;
    async function deleteLeaderboard(command) {
        if (command.arguments.length != 1) {
            logger_1.default.warn("LDBD_BAD_PARAM: Incorrect number of parameters provided");
            return errorCodes_1.ErrorCodes.LDBD_BAD_PARAM;
        }
        const name = command.arguments[0];
        let existingLeaderboards = await LeaderboardDAO_1.LeaderboardDAO.getLeaderboard(name);
        if (existingLeaderboards.length == 0) {
            logger_1.default.warn("LDBD_NOT_FOUND: No leaderboard found for query");
            return errorCodes_1.ErrorCodes.LDBD_NOT_FOUND;
        }
        const id = existingLeaderboards[0].id;
        await ValueDAO_1.ValueDAO.deleteValueByLeaderboard(id);
        await RowDAO_1.RowDAO.deleteLeaderboardRows(id);
        await ColumnDAO_1.ColumnDAO.deleteLeaderboardColumns(id);
        await LeaderboardDAO_1.LeaderboardDAO.deleteLeaderboard(id);
        logger_1.default.info("Deleted leaderboard " + name);
        return true;
    }
    LeaderboardController.deleteLeaderboard = deleteLeaderboard;
})(LeaderboardController = exports.LeaderboardController || (exports.LeaderboardController = {}));
//# sourceMappingURL=LeaderboardController.js.map