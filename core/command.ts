import { Message } from 'discord.js';

export class Command {
    
    plugin: string;
    action: string;
    arguments: string[];
    originalMessage: Message;

    constructor(message: Message) {
        let input = this.stripPrefix(message.content);
        let parts: string[] = input.split(' ');

        this.plugin = parts[0];

        if (parts.length > 1) {
            this.action = parts[1];
        }

        if (parts.length > 2) {
            parts = parts.splice(0, 2);
            this.arguments = parts;
        }

        this.originalMessage = message;
    };

    stripPrefix = (message: string): string => {
        return message.substr(process.env.PREFIX.length);
    };
};