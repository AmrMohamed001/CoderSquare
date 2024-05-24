import dotenv from 'dotenv';
dotenv.config();
import { app } from './app';
import { pool } from './config/databaseConfig';

(async function () {
	try {
		await pool.connect({
			host: process.env.DB_HOST!,
			port: +process.env.DB_PORT!,
			database: process.env.DATABASE!,
			user: process.env.DB_USER!,
			password: process.env.DB_PASSWORD!,
		});
		console.log('pg connected');
		app.listen(process.env.PORT || 3000, () =>
			console.log(`server started on port ${process.env.PORT} 🚀`)
		);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
})();
