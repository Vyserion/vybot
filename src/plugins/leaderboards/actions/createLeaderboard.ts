import { ActionHandlerStrategy } from "../config";
import { TCommand } from "../../../core/typings";
import { commandHasCorrectArgumentLength, leaderboardExists } from "../util/validators";
import { createLeaderboard } from "../dao/leaderboards";
import logger from "../../../core/util/logger";
import { getGuildId } from "../../../core/guilds/guilds";

export class CreateLeaderboardHandler implements ActionHandlerStrategy {
	private readonly command: TCommand;

	constructor(command: TCommand) {
		this.command = command;
	}

	async handleAction(): Promise<string> {
		const correctArguments = commandHasCorrectArgumentLength(this.command, 1);
		if (!correctArguments) {
			return "No name was provided for the leaderboard.";
		}

		const guildId = await getGuildId(this.command.originalMessage.guild);

		const name = this.command.arguments[0];

		const exists = await leaderboardExists(name, guildId);
		if (exists) {
			return `A leaderboard with the name ${name} already exists.`;
		}

		await createLeaderboard(name, guildId);
		logger.info(`Created new leaderboard ${name}`);
		return `Successfully created leaderboard ${name}.`;
	}
}
