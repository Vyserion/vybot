import { Message } from "discord.js";

export type TCommand = {
    plugin: string;
    action?: string;
    arguments: string[];
    originalMessage: Message;
}

export function createCommand(message: Message): TCommand {
    let input = stripPrefix(message.content);
    let parts: string[] = input.split(" ");

    const command: TCommand = {
        plugin: parts[0],
        originalMessage: message,
        arguments: []
    };

    if (parts.length >= 2) {
        command.action = parts[1];
    }

    if (parts.length >= 3) {
        const remainingParts: string[] = parts.splice(2, parts.length);
        command.arguments = parseArguments(remainingParts);
    }

    return command;
}

function stripPrefix(message: string): string {
    return message.substr(process.env.PREFIX.length);
}

function parseArguments(inputs: string[]): string[] {
    let parsedArguments: string[] = [];

		let buffer: string = "";
		for (let input of inputs) {
			if (input.startsWith("'")) {
				let temp: string = input.substring(1, input.length);
				buffer = temp;
			} else if (input.endsWith("'")) {
				let temp: string = input.substring(0, input.length - 1);
				buffer += " " + temp;
				parsedArguments.push(buffer);
				buffer = "";
			} else if (buffer.length > 0) {
				buffer += " " + input;
			} else {
				parsedArguments.push(input);
			}
		}

		return parsedArguments;
}