import pg from 'pg';
interface Options {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
}
export class Pool {
	private pool: any;
	connect(options: Options) {
		this.pool = new pg.Pool(options);
		return this.pool.query(`SELECT 1+1;`);
	}
	close() {
		return this.pool.end();
	}
	query(sql: string, params?: string[]) {
		return this.pool.query(sql, params);
	}
}
const pool = new Pool();
export { pool };
