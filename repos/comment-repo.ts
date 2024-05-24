import { pool } from '../config/databaseConfig';
import { partialComment } from '../types/typeApi';
import { Comment } from '../types/typeComment';

export class CommentRepo {
	static async insert(data: partialComment): Promise<Comment> {
		const { rows } = await pool.query(
			`
        INSERT INTO comments(comment,postid,userid)
        VALUES($1,$2,$3)
        RETURNING *
        `,
			[data.comment, data.postid, data.userid]
		);
		return rows[0];
	}

	static async find(postid: string): Promise<Comment[] | undefined> {
		const { rows } = await pool.query(
			`SELECT * FROM comments WHERE postid=$1`,
			[postid]
		);
		return rows;
	}

	static async findByIdAndDelete(
		commentid: string
	): Promise<Comment | undefined> {
		const { rows } = await pool.query(
			`DELETE FROM comments WHERE id=$1 RETURNING *`,
			[commentid]
		);
		return rows[0];
	}
}
