import { Post } from '../dtos/post.dto';

export interface ListPostReq {}
export interface ListPostRes {
	status: string;
	count: number;
	data: { rows: Post[] };
}

export interface CreatePostRes {
	status: string;
	message?: string;
	data: { post: Post };
}

export interface GetPostReq {
	params: {
		id: string;
	};
}
export interface GetPostRes {
	status: string;
	message?: string;
	data?: { post: Post; likes?: number };
}
