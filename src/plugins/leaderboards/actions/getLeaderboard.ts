import { ActionHandlerStrategy } from "../config";
import { TCommand } from "../../../core/typings";
import { commandHasCorrectArgumentLength } from "../util/validators";
import { getLeaderboard } from "../dao/leaderboards";
import { getColumns } from "../dao/columns";
import { getRows } from "../dao/rows";
import { getValues } from "../dao/values";
import { TLeaderboard } from "../typings";
import { prettyPrintLeaderboard } from "../util/format";
import { getGuildId } from "../../../core/guilds/guilds";

export class GetLeaderboardHandler implements ActionHandlerStrategy {
	private readonly command: TCommand;

	constructor(command: TCommand) {
		this.command = command;
	}

	async handleAction(): Promise<string> {
		const correctArguments = commandHasCorrectArgumentLength(this.command, 1);
		if (!correctArguments) {
			return "No name was provided.";
		}

		const guild = await getGuildId(this.command.originalMessage.guild);
		const name = this.command.arguments[0];
		const leaderboard = await getLeaderboard(name, guild);
		if (!leaderboard) {
			return `A leaderboard with the name ${name} was not found.`;
		}

		const columns = await getColumns(leaderboard.id);
		const rows = await getRows(leaderboard.id);
		const values = await getValues(leaderboard.id);

		const filledLeaderboard: TLeaderboard = {
			name: leaderboard.name,
			rows,
			columns,
			values,
		};

		return prettyPrintLeaderboard(filledLeaderboard);
	}
}
