import { Like } from '../dtos/like.dto';
import { pool } from '../config/databaseConfig';
import { partialLike } from '../types/like.type';

export class LikeRepo {
	static async insert(data: partialLike): Promise<Like> {
		const { rows } = await pool.query(
			`INSERT INTO likes(userid,postid) VALUES($1,$2) RETURNING *`,
			[data.userid, data.postid]
		);
		return rows[0];
	}
	static async getLikesCount(postId: string): Promise<number> {
		const { rows } = await pool.query(
			`
			SELECT COUNT(*) FROM likes WHERE postid =$1  GROUP BY postid 
			`,
			[postId]
		);
		return rows[0].count;
	}
}
