import { User } from '../types/typeUser';
import { pool } from '../config/databaseConfig';
import { returnedUser, partialUser } from '../types/typeApi';
export class UserRepo {
	static async findByEmail(str: string): Promise<returnedUser | undefined> {
		const { rows } = await pool.query(
			`
        SELECT * FROM users WHERE email = $1
        `,
			[str]
		);
		return rows[0];
	}

	static async findByCode(str: string): Promise<returnedUser | undefined> {
		const { rows } = await pool.query(
			`
        SELECT * FROM users WHERE reset_code = $1
        `,
			[str]
		);
		return rows[0];
	}

	static async findById(str: number): Promise<returnedUser | undefined> {
		const { rows } = await pool.query(
			`
        SELECT * FROM users WHERE id = $1
        `,
			[`${str}`]
		);
		return rows[0];
	}

	static async insert(body: partialUser): Promise<returnedUser> {
		const { rows } = await pool.query(
			`
        INSERT INTO users(firstname,lastname,username,email,password)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
			[body.firstname, body.lastname, body.username, body.email, body.password!]
		);
		return rows[0];
	}

	static async findByIdAndUpdate(id: string, body: any): Promise<void> {
		let setClauseParts: string | string[] = [];
		let values = [id];
		const columns = Object.keys(body);
		columns.forEach((column, index) => {
			setClauseParts.push(`${column} = $${index + 2}`);
			values.push(body[column]);
		});
		const setClause = setClauseParts.join(', ');
		await pool.query(
			`
        UPDATE users
		SET ${setClause}
		WHERE id=$1;
        `,
			values
		);
	}
}
