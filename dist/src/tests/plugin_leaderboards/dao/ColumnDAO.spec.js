"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const dataManager_1 = require("../../../core/dataManager");
const ColumnDAO_1 = require("../../../plugin_leaderboards/dao/ColumnDAO");
describe("ColumnDAO ::", () => {
    beforeEach(() => {
        sinon_1.stub(dataManager_1.DataManager, "query").returns(true);
    });
    afterEach(() => {
        dataManager_1.DataManager.query.restore();
    });
    describe("getLeaderboardColumns()", () => {
        it("should query for leaderboard columns with the correct parameters", async () => {
            const expectedId = 1;
            const expectedQuery = ` SELECT * FROM leaderboard_columns WHERE leaderboard_id = $1`;
            const result = await ColumnDAO_1.ColumnDAO.getLeaderboardColumns(expectedId);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            const query = call.args[0];
            chai_1.expect(query).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const id = queryArguments[0];
            chai_1.expect(id).to.equal(expectedId);
        });
    });
    describe("getLeaderboardColumn()", () => {
        it("should query for a leaderboard column with the correct parameters", async () => {
            const expectedId = 1;
            const columnName = "name";
            const expectedQuery = ` SELECT * FROM leaderboard_columns WHERE leaderboard_id = $1 AND name = $2`;
            const result = await ColumnDAO_1.ColumnDAO.getLeaderboardColumn(expectedId, columnName);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            const query = call.args[0];
            chai_1.expect(query).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const id = queryArguments[0];
            chai_1.expect(id).to.equal(expectedId);
            const name = queryArguments[1];
            chai_1.expect(name).to.equal(columnName);
        });
    });
    describe("insertLeaderboardColumn()", () => {
        it("should insert a leaderboard column with the correct parameters.", async () => {
            const leaderboardId = 1;
            const expectedColumnName = "columnName";
            const expectedColumnType = "col";
            const expectedQuery = " INSERT INTO leaderboard_columns VALUES (DEFAULT, $1, $2, $3)";
            const result = await ColumnDAO_1.ColumnDAO.insertLeaderboardColumn(leaderboardId, expectedColumnName, expectedColumnType);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            const query = call.args[0];
            chai_1.expect(query).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const id = queryArguments[0];
            chai_1.expect(id).to.equal(leaderboardId);
            const name = queryArguments[1];
            chai_1.expect(name).to.equal(expectedColumnName);
            const type = queryArguments[2];
            chai_1.expect(type).to.equal(expectedColumnType);
        });
    });
    describe("updateLeaderboardColumnName()", () => {
        it(`should update a leaderboard column's type with the correct parameters.`, async () => {
            const expectedLeaderboardId = 123;
            const expectedId = 456;
            const expectedNewName = "New Name";
            const expectedQuery = ` UPDATE leaderboard_columns SET name = ($3) WHERE leaderboard_id = ($1) AND id = ($2)`;
            const result = await ColumnDAO_1.ColumnDAO.updateLeaderboardColumnName(expectedLeaderboardId, expectedId, expectedNewName);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            const queryArgument = call.args[0];
            chai_1.expect(queryArgument).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const leaderboardId = queryArguments[0];
            chai_1.expect(leaderboardId).to.equal(expectedLeaderboardId);
            const columnId = queryArguments[1];
            chai_1.expect(columnId).to.equal(expectedId);
            const name = queryArguments[2];
            chai_1.expect(name).to.equal(expectedNewName);
        });
    });
    describe("updateLeaderboardColumnType()", () => {
        it(`should update a leaderboard column's type with the correct parameters`, async () => {
            const expectedLeaderboardId = 123;
            const expectedId = 456;
            const expectedType = "Type";
            const expectedQuery = " UPDATE leaderboard_columns SET type = ($3) WHERE leaderboard_id = ($1) AND id = ($2)";
            const result = await ColumnDAO_1.ColumnDAO.updateLeaderboardColumnType(expectedLeaderboardId, expectedId, expectedType);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            const queryArgument = call.args[0];
            chai_1.expect(queryArgument).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const leaderboardId = queryArguments[0];
            chai_1.expect(leaderboardId).to.equal(expectedLeaderboardId);
            const columnId = queryArguments[1];
            chai_1.expect(columnId).to.equal(expectedId);
            const type = queryArguments[2];
            chai_1.expect(type).to.equal(expectedType);
        });
    });
    describe("deleteLeaderboardColumns()", () => {
        it("should delete leaderboard columns with the correct parameters.", async () => {
            const expectedId = 123;
            const expectedQuery = ` DELETE FROM leaderboard_columns WHERE leaderboard_id = ($1)`;
            const result = await ColumnDAO_1.ColumnDAO.deleteLeaderboardColumns(expectedId);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            let query = call.args[0];
            chai_1.expect(query).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const leaderboardId = queryArguments[0];
            chai_1.expect(leaderboardId).to.equal(expectedId);
        });
    });
    describe("deleteLeaderboardColumn()", () => {
        it("should delete a leaderboard column with the correct parameters.", async () => {
            const expectedLeaderboardId = 123;
            const expectedId = 456;
            const expectedQuery = ` DELETE FROM leaderboard_columns WHERE leaderboard_id = ($1) AND id = ($2)`;
            const result = await ColumnDAO_1.ColumnDAO.deleteLeaderboardColumn(expectedLeaderboardId, expectedId);
            chai_1.expect(dataManager_1.DataManager.query.called).to.be.true;
            const call = dataManager_1.DataManager.query.getCall(0);
            let query = call.args[0];
            chai_1.expect(query).to.equal(expectedQuery);
            const queryArguments = call.args[1];
            const leaderboardId = queryArguments[0];
            chai_1.expect(leaderboardId).to.equal(expectedLeaderboardId);
            const columnId = queryArguments[1];
            chai_1.expect(columnId).to.equal(expectedId);
        });
    });
});
//# sourceMappingURL=ColumnDAO.spec.js.map