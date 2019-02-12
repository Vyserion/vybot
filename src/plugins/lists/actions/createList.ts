import { IActionHandlerStrategy } from "../config/actions";
import { TCommand } from "../../../core/typings";
import { getGuildId } from "../../../util/guilds";
import { listExists } from "../utils/validators";
import { Lists } from "../dao/lists";
import logger from "../../../core/util/logger";

export class CreateListHandler implements IActionHandlerStrategy {
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

        const exists = await listExists(name, guildId);
        if (exists) {
            return `A list with the name ${name} already exists.`;
        }

        await Lists.createList(guildId, name);
        logger.info(`Created new list ${name}`);
        return `Successfully created list ${name}`;
    }
}