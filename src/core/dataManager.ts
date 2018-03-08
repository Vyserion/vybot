import { Pool, Client, QueryResult } from 'pg';
import logger from './logger';

export namespace DataManager {

    const port: number = process.env.POSTGRES_PORT as any as number;
    
    let pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: port
    });

    pool.on('error', (err, client) => {
        logger.error('Unexpected error on idle client', err);
        process.exit(-1);
    });

    export function query (query: string, params?: any[]): any[] {
        let results: QueryResult = this.doQuery(query, params);
        return results.rows;
    };

    async function doQuery (query: string, params?: any[]) {
        let results: QueryResult;

        try {
            if (params) {
                results = await pool.query(query, params)
            } else {
                results = await pool.query(query);
            }
            
            return results;
        } catch (e) {
            logger.error('Error running query: ' + query);
            logger.error('Error code: ' + e.code);
            return {
                rows: []
            };
        }
    }
}