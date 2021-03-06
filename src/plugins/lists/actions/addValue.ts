import { ActionHandlerStrategy } from "../config/actions";
import { TCommand } from "../../../core/typings";
import { getGuildId } from "../../../core/guilds/guilds";
import { getList } from "../dao/lists";
import { addValue } from "../dao/values";
import logger from "../../../core/util/logger";

export class AddValueHandler implements ActionHandlerStrategy {
	private readonly command: TCommand;

	constructor(command: TCommand) {
		this.command = command;
	}

	async handleAction(): Promise<string> {
		if (this.command.arguments.length < 2) {
			return "No list name or value was provided.";
		}

		const guildId = await getGuildId(this.command.originalMessage.guild);

		const listName = this.command.arguments[0];

		const list = await getList(guildId, listName);
		if (!list) {
			return `A list with the name ${listName} does not exist.`;
		}

		const value = this.command.arguments[1];

		await addValue(list.id, value);
		logger.info(`Added new value ${value} to list ${listName}`);
		return `Successfully added value ${value}.`;
	}
}
