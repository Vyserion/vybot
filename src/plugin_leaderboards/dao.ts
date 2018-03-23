import { DataManager } from '../core/dataManager';
import logger from '../core/logger';

export class LeaderboardDAO {

    getLeaderboards = async () => {
        let query = ` SELECT * FROM leaderboards`;

        logger.debug('Running query:');
        logger.debug(query);

        try {
            let results: any[] = await DataManager.query(query);
            return results;
        } catch (e) {
            logger.error('Unexpected error when inserting leaderboard');
            logger.error(e);
            return;
        }
    }

    getLeaderboard = async (name: string) => {
        let query = ` SELECT * FROM leaderboards WHERE name = ($1)`;
        let params = [name];

        logger.debug('Running query');
        logger.debug(query);

        try {
            let results: any[] = await DataManager.query(query, params);
            return results;
        } catch (e) {
            logger.error('Unexpected error when getting leaderboard');
            logger.error(e);
            return;
        }
    }

    insertLeaderboard = async (name: string) => {
        let query = ` INSERT INTO leaderboards VALUES (DEFAULT, $1)`;
        let params = [name];
    
        // TODO: WE NEED TO DO SOMETHING WITH NAMES WITH SPACES HERE - hash the name?
    
        logger.debug('Running query:');
        logger.debug(query);
        
        try {
            let results: any[] = await DataManager.query(query, params);
            return results;
        } catch (e) {
            logger.error('Unexpected error when inserting leaderboard');
            logger.error(e);
            return;
        }
    }

    updateLeaderboard = async (id: number, name: string) => {
        let query = ` UPDATE leaderboards SET name = ($1) WHERE id = ($2)`;
        let params = [name, id];
    
        logger.debug('Running query');
        logger.debug(query);
    
        try {
            let results: any[] = await DataManager.query(query, params);
            return results;
        } catch (e) {
            logger.error('Unexpected error when updating leaderboard');
            logger.error(e);
            return;
        }
    }

    deleteLeaderboard = async (id: number) => {
        let query = ` DELETE FROM leaderboards WHERE id = ($1)`;
        let params = [id];
    
        logger.debug('Running query');
        logger.debug(query);
    
        try {
            let results: any[] = await DataManager.query(query, params);
            return results;
        } catch (e) {
            logger.error('Unexpected error when deleting leaderboard');
            logger.error(e);
            return;
        }
    }
}