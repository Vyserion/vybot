import "mocha";
import { expect } from "chai";
import { mock, instance, when } from "ts-mockito";
import { LeaderboardDAO } from "../../../plugin_leaderboards/dao/LeaderboardDAO";
import { ColumnDAO } from "../../../plugin_leaderboards/dao/ColumnDAO";
import { LeaderboardController } from "../../../plugin_leaderboards/controllers/LeaderboardController";
import { ReturnCodes } from "../../../plugin_leaderboards/config/ReturnCodes";
import { Command } from "../../../core/command";
import { ColumnTypes } from "../../../plugin_leaderboards/config/ColumnTypes";
import { Leaderboard } from "../../../plugin_leaderboards/models";
import { stub } from "sinon";

describe("LeaderboardController ::", () => {
	describe("getLeaderboards()", () => {
		it("should return the list of leaderboards from the DAO.", async () => {
			stub(LeaderboardDAO, "getLeaderboards").returns(["leaderboard"]);

			const result = await LeaderboardController.getLeaderboards();
			expect(result.length).to.equal(1);

			(LeaderboardDAO.getLeaderboards as any).restore();
		});
	});

	describe("getLeaderboard()", () => {
		it("should check for less than one argument.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn([]);

			const result = await LeaderboardController.getLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should return an error when no leaderboard is found with that id.", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await LeaderboardController.getLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.LEADERBOARD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return the correct leaderboard when it is found, with columns", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([
				{
					id: 1,
					name: leaderboardName
				}
			]);

			const columnName = "col";
			const columnType = ColumnTypes.DATA;
			stub(ColumnDAO, "getLeaderboardColumns").returns([
				{
					name: columnName,
					type: columnType
				}
			]);

			const result = await LeaderboardController.getLeaderboard(instance(command));

			const resultLeaderboard: Leaderboard = <Leaderboard>result;
			expect(resultLeaderboard.name).to.equal(leaderboardName);
			expect(resultLeaderboard.columns.length).to.equal(1);
			expect(resultLeaderboard.columns[0].name).to.equal(columnName);
			expect(resultLeaderboard.columns[0].type).to.equal(columnType);

			(LeaderboardDAO.getLeaderboard as any).restore();
			(ColumnDAO.getLeaderboardColumns as any).restore();
		});
	});

	describe("insertLeaderboard()", () => {
		it("should check for less than one argument.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn([]);

			const result = await LeaderboardController.insertLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should check for more than one argument.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["one", "two"]);

			const result = await LeaderboardController.insertLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should return an error when a leaderboard with the same name is detected.", async () => {
			const leaderboardName: string = "leaderboardname";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([leaderboardName]);

			const result = await LeaderboardController.insertLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.LEADERBOARD_DUPLICATE_NAME);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return true when the leaderboard is inserted correctly.", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);
			stub(LeaderboardDAO, "insertLeaderboard").returns([]);

			const result = await LeaderboardController.insertLeaderboard(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(LeaderboardDAO.insertLeaderboard as any).restore();
		});
	});

	describe("updateLeaderboard()", () => {
		it("should check for less than 2 arguments", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn([]);

			const result = await LeaderboardController.updateLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should check for more than 2 arguments", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["", "", ""]);

			const result = await LeaderboardController.updateLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should return an error when no leaderboard is found with that name", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await LeaderboardController.updateLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.LEADERBOARD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return true when the leaderboard column is updated", async () => {
			const leaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(LeaderboardDAO, "updateLeaderboard");

			const result = await LeaderboardController.updateLeaderboard(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(LeaderboardDAO.updateLeaderboard as any).restore();
		});
	});

	describe("deleteLeaderboard()", () => {
		it("should check for less than 1 arguments", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn([]);

			const result = await LeaderboardController.deleteLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should check for more than 1 argument", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["", ""]);

			const result = await LeaderboardController.deleteLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.INCORRECT_PARAM_LENGTH);
		});

		it("should return an error when no leaderboard is found with that name", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await LeaderboardController.deleteLeaderboard(instance(command));
			expect(result).to.equal(ReturnCodes.LEADERBOARD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return true when the leaderboard column is updated", async () => {
			const leaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(LeaderboardDAO, "deleteLeaderboard");
			stub(ColumnDAO, "deleteLeaderboardColumns");

			const result = await LeaderboardController.deleteLeaderboard(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(LeaderboardDAO.deleteLeaderboard as any).restore();
			(ColumnDAO.deleteLeaderboardColumns as any).restore();
		});
	});
});