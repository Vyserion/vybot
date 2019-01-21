import { IActionHandlerStrategy } from "../config";
import { TCommand } from "../../../core/typings";
import { commandHasCorrectArgumentLength } from "../util/validators";
import { getLeaderboard } from "../dao/leaderboards";
import { getRow, deleteRow } from "../dao/rows";
import { deleteValuesByRow } from "../dao/values";

export class DeleteRowHandler implements IActionHandlerStrategy {
    private readonly command: TCommand;

    constructor(command: TCommand) {
        this.command = command;
    }

    async handleAction(): Promise<string> {
        const correctArguments = commandHasCorrectArgumentLength(this.command, 2);
        if (!correctArguments) {
            return "No leaderboard or row name was provided.";
        }

        const leaderboardName = this.command.arguments[0];
        const leaderboard = await getLeaderboard(leaderboardName);
        if (!leaderboard) {
            return `A leaderboard with the name ${leaderboardName} was not found.`;
        }

        const rowName = this.command.arguments[1];
        const row = await getRow(rowName, leaderboard.id);
        if (!row) {
            return `A row with the name ${rowName} for the leaderboard ${leaderboardName} was not found.`;
        }

        await deleteValuesByRow(row.id);
        await deleteRow(row.id);
        return `Successfully removed row ${rowName}.`;
    }
}