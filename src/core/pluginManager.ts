import { Command } from "./command";
import { notAPluginMessage } from "./messages";
import { LeaderboardHandler } from "../plugin_leaderboards/leaderboardHandler";
import { Message } from "discord.js";

let plugins: any[];

export function registerPlugins() {
    plugins = [];
    plugins.push(new LeaderboardHandler());
}

export function handlePluginMessage(message: Message) {
    let command: Command = new Command(message);

    if (!this.isPluginValid(command.plugin)) {
        message.channel.send(notAPluginMessage);
        return;
    }

    this.handleMessage(command, message);
}

export function handleMessage(command: Command, message: Message) {
    let plugin = plugins.find(p => p.name === command.plugin);
    plugin.handleCommand(command, message);
}

export function isPluginMessage(message: string): boolean {
    return message.startsWith(process.env.PREFIX) && message.length > 1;
}

export function isPluginValid(pluginName: string): boolean {
    const found = plugins.find(p => p.name === pluginName);
    return found !== undefined;
}