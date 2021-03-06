import { ActionHandlerStrategy } from "../config/actions";
import { TCommand } from "../../../core/typings";
import { getGuildId } from "../../../core/guilds/guilds";
import { getList } from "../dao/lists";
import { getValues } from "../dao/values";
import { prettyPrintList } from "../utils/format";

export class GetListHandler implements ActionHandlerStrategy {
	private readonly command: TCommand;

	constructor(command: TCommand) {
		this.command = command;
	}

	async handleAction(): Promise<string> {
		if (this.command.arguments.length < 1) {
			return "No name was provided for the list.";
		}

		const guildId = await getGuildId(this.command.originalMessage.guild);

		const name = this.command.arguments[0];

		const list = await getList(guildId, name);
		if (!list) {
			return `A list with the name ${name} does not exist.`;
		}

		const values = await getValues(list.id);
		list.values = values;

		return prettyPrintList(list);
	}
}
