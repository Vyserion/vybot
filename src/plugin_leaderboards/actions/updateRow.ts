import { ReturnCodes } from "../config/ReturnCodes";
import { Command } from "../../core/command";
import { RowController } from "../controllers/RowController";

export async function updateLeaderboardRow(command: Command): Promise<string> {
	const result = await RowController.updateLeaderboardRow(command);

	let response;
	switch (result) {
		case ReturnCodes.INCORRECT_PARAM_LENGTH: {
			if (command.arguments.length < 3) {
				response = `Not enough parameters provided - please check you have a Leaderboard Name, Column Name, and the new Column Name`;
			} else {
				response = `Too many parameters were provided`;
			}
			break;
		}
		case ReturnCodes.LEADERBOARD_NOT_FOUND: {
			response = `A leaderboard with the name ${command.arguments[0]} was not found`;
			break;
		}
		case ReturnCodes.ROW_NOT_FOUND: {
			response = `A leaderboard with the name ${command.arguments[1]} was not found`;
			break;
		}
		default: {
			response = `Successfully updates the leaderboard row ${command.arguments[1]}`;
			break;
		}
	}

	return response;
}