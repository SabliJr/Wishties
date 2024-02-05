import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: 'macbookpro',
  host: 'localhost',
  port: 5432,
  password: 'postgres',
  database: 'wishties',
});

const query = async (text: string, params: any[] | undefined): Promise<QueryResult> => {
  return await pool.query(text, params);
};

export { query, pool };
