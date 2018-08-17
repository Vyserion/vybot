import "mocha";
import { expect } from "chai";
import { mock, instance, when, anything } from "ts-mockito";
import { LeaderboardDAO } from "../../../plugin_leaderboards/dao/LeaderboardDAO";
import { ColumnDAO } from "../../../plugin_leaderboards/dao/ColumnDAO";
import { RowController } from "../../../plugin_leaderboards/controllers/RowController";
import { ErrorCodes } from "../../../plugin_leaderboards/config/errorCodes";
import { Command } from "../../../core/command";
import { stub } from "sinon";
import Leaderboard from "../../../plugin_leaderboards/models/Leaderboard";
import { RowDAO } from "../../../plugin_leaderboards/dao/RowDAO";
import { AsyncResource } from "async_hooks";
import getLeaderboard from "../../../plugin_leaderboards/actions/getLeaderboard";

describe("RowController ::", () => {
	describe("insertLeaderboardRow()", () => {
		it("should check for less than 2 arguments.", async () => {
			const zeroCommand: Command = mock(Command);
			when(zeroCommand.arguments).thenReturn([]);

			const zeroResult = await RowController.insertLeaderboardRow(instance(zeroCommand));
			expect(zeroResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);

			const oneCommand: Command = mock(Command);
			when(oneCommand.arguments).thenReturn(["1"]);

			const oneResult = await RowController.insertLeaderboardRow(instance(oneCommand));
			expect(oneResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should check for more than 2 arguments.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["1", "2", "3"]);

			const result = await RowController.insertLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should return an error code when no leaderboard is found with that id.", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await RowController.insertLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return an error when a row is found with the same name.", async () => {
			const leaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;
			const rowName: string = "rowName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, rowName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([rowName]);

			const result = await RowController.insertLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_DUP_NAME);

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
		});

		it("should return true when the leaderboard row is inserted correctly.", async () => {
			const LeaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;
			const rowName: string = "rowName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([LeaderboardName, rowName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([]);
			stub(RowDAO, "insertLeaderboardRow");

			const result = await RowController.insertLeaderboardRow(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
			(RowDAO.insertLeaderboardRow as any).restore();
		});
	});

	describe("updateLeaderboardRow()", () => {
		it("should check for less than 3 arguments.", async () => {
			const zeroCommand: Command = mock(Command);
			when(zeroCommand.arguments).thenReturn([]);

			const zeroResult = await RowController.updateLeaderboardRow(instance(zeroCommand));
			expect(zeroResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);

			const twoCommand: Command = mock(Command);
			when(twoCommand.arguments).thenReturn(["", ""]);

			const twoResult = await RowController.updateLeaderboardRow(instance(twoCommand));
			expect(twoResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should check for more than 3 arguments.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["", "", "", ""]);

			const result = await RowController.updateLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should return an error code when no leaderboard is found with that name.", async () => {
			const leaderboardName: string = "leaderboardName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, "", ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await RowController.updateLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return an error code when no leaderboard row could be found with that name", async () => {
			const leaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;
			const rowName: string = "rowName";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, rowName, ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([]);

			const result = await RowController.updateLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_ROW_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
		});

		it("should return true when the name is updated.", async () => {
			const leaderboardName: string = "leaderboardName";
			const leaderboardId: number = 1;
			const rowName: string = "rowName";
			const rowId: number = 2;

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, rowName, "New Row Name"]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([{ id: rowId }]);

			const result = await RowController.updateLeaderboardRow(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
		});
	});

	describe("deleteLeaderboardRow()", async () => {
		it("should check for less than 2 arguments.", async () => {
			const zeroCommand: Command = mock(Command);
			when(zeroCommand.arguments).thenReturn([]);

			const zeroResult = await RowController.deleteLeaderboardRow(instance(zeroCommand));
			expect(zeroResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);

			const oneCommand: Command = mock(Command);
			when(oneCommand.arguments).thenReturn([""]);

			const oneResult = await RowController.deleteLeaderboardRow(instance(oneCommand));
			expect(oneResult).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should check for more than 2 arguments.", async () => {
			const command: Command = mock(Command);
			when(command.arguments).thenReturn(["", "", ""]);

			const result = await RowController.deleteLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_BAD_PARAM);
		});

		it("should return an error when no leaderboard is found with that name.", async () => {
			const leaderboardName: string = "leaderboard name";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, ""]);

			stub(LeaderboardDAO, "getLeaderboard").returns([]);

			const result = await RowController.deleteLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
		});

		it("should return an error when no leaderboard row is found with that name", async () => {
			const leaderboardName: string = "leaderboard name";
			const leaderboardId: number = 1;
			const rowName: string = "row name";

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, rowName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([]);

			const result = await RowController.deleteLeaderboardRow(instance(command));
			expect(result).to.equal(ErrorCodes.LDBD_ROW_NOT_FOUND);

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
		});

		it("should return true when the leaderboard row is deleted.", async () => {
			const leaderboardName: string = "leaderboard name";
			const leaderboardId: number = 1;
			const rowName: string = "row name";
			const rowId: number = 2;

			const command: Command = mock(Command);
			when(command.arguments).thenReturn([leaderboardName, rowName]);

			stub(LeaderboardDAO, "getLeaderboard").returns([{ id: leaderboardId }]);
			stub(RowDAO, "getLeaderboardRow").returns([{ id: rowId }]);

			const result = await RowController.deleteLeaderboardRow(instance(command));
			expect(result).to.be.true;

			(LeaderboardDAO.getLeaderboard as any).restore();
			(RowDAO.getLeaderboardRow as any).restore();
		});
	});
});
