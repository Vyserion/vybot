import { Commands } from "../Commands";
import { ColumnTypes } from "../ColumnTypes";

export const createColumn = `This command will create a new column for the given leaderboard.
    This column name must be unique for the leaderboard.
    
    Model:
    ${process.env.PREFIX}leaderboards ${Commands.CREATE_COLUMN} [leaderboard name] [column name] {column type}
    
    Example, with default column type:
    ${process.env.PREFIX}leaderboards ${Commands.CREATE_COLUMN} "My Leaderboard" "A Column"
    
    Example, with a given type:
    ${process.env.PREFIX}leaderboards ${Commands.CREATE_COLUMN} "My Leaderboard" "A Column" ${ColumnTypes.DATA}
    
    Allowed Column Types:
    - ${ColumnTypes.DATA}`;