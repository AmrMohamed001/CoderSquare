import { pool } from '../config/databaseConfig';

import { Post } from '../dtos/post.dto';
import { partialPost } from '../types/post.type';
//////////////////////////////////////////////////////

export class PostRepo {
	static async find(): Promise<Post[]> {
		const { rows } = await pool.query(`
		SELECT 
			posts.*, 
			COALESCE(likes_count.likes, 0) as likes
		FROM 
    		posts
		LEFT JOIN (
    		SELECT 
				posts.id, 
				COUNT(likes.postid) AS likes
    		FROM 
        		posts 
    		LEFT JOIN likes 
    		ON posts.id = likes.postid 
    		GROUP BY posts.id
			) AS likes_count 
		ON posts.id = likes_count.id;`);
		return rows;
	}

	static async findById(id: string): Promise<Post | undefined> {
		const { rows } = await pool.query(`SELECT * FROM posts WHERE id= $1;`, [
			id,
		]);
		return rows[0];
	}
	static async insert(postBody: partialPost): Promise<Post> {
		const { rows } = await pool.query(
			`INSERT INTO posts(title,url,userid) VALUES($1, $2,$3) RETURNING *`,
			[postBody.title, postBody.url, postBody.userid]
		);
		return rows[0];
	}
	static async findAndDelete(id: string): Promise<Post | undefined> {
		const { rows } = await pool.query(
			`DELETE FROM posts WHERE id=$1 RETURNING *`,
			[id]
		);
		console.log(rows);

		return rows[0];
	}
}
