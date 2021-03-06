import { ActionHandlerStrategy } from "../config/actions";
import { TCommand } from "../../../core/typings";
import { getGuildId } from "../../../core/guilds/guilds";
import { getLists } from "../dao/lists";

export class GetListsHandler implements ActionHandlerStrategy {
	private readonly command: TCommand;

	constructor(command: TCommand) {
		this.command = command;
	}

	async handleAction(): Promise<string> {
		const guildId = await getGuildId(this.command.originalMessage.guild);
		const lists = await getLists(guildId);

		if (lists.length === 0) {
			return `There are currently no lists`;
		}

		let response = ``;

		lists.forEach((l) => {
			response += l.name;
			response += `\n`;
		});

		return response;
	}
}
