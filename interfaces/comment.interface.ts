import { Comment } from '../dtos/comment.dto';

export interface CreateCommentRes {
	status: string;
	message?: string;
	data?: { comment: Comment };
}

export interface ListCommentsReq {}
export interface ListCommentsRes {
	status: string;
	data: { comments: Comment[] | undefined };
}

export interface DeleteCommentReq {
	params: {
		id: string;
	};
}
export interface DeleteCommentRes {
	status: string;
	data: null;
}
