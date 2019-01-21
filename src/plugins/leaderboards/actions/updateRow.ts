import { IActionHandlerStrategy } from "../config";
import { TCommand } from "../../../core/typings";
import { commandHasCorrectArgumentLength, rowExists } from "../util/validators";
import { getLeaderboard } from "../dao/leaderboards";
import { getRow, updateRowName } from "../dao/rows";
import logger from "../../../core/util/logger";

export class UpdateRowHandler implements IActionHandlerStrategy {
    private readonly command: TCommand;

    constructor(command: TCommand) {
        this.command = command;
    }

    async handleAction(): Promise<string> {
        const correctArguments = commandHasCorrectArgumentLength(this.command, 3);
        if (!correctArguments) {
            return `Not enough details - please check your command.`;
        }

        const leaderboardName = this.command.arguments[0];
        const leaderboard = await getLeaderboard(leaderboardName);
        if (!leaderboard) {
            return `A leaderboard with the name ${leaderboardName} was not found.`;
        }

        const rowName = this.command.arguments[1];
        const row = await getRow(rowName, leaderboard.id);
        if (!row) {
            return `A row with the name ${rowName} for leaderboard ${leaderboardName} was not found.`;
        }

        const newName = this.command.arguments[2];
        const exists = await rowExists(newName, leaderboard.id);
        if (exists) {
            return `A row with the name ${newName} for leaderboard ${leaderboardName} already exists.`;
        }

        await updateRowName(row.id, newName);
        logger.info(`Successfully updated leaderboard ${name} to ${newName}`);
        return `Successfully updated row ${name}.`;
    }
}