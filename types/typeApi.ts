import { RequestHandler, Request } from 'express';
import { Post } from './typePost';
import { Like } from './typeLike';
import { Comment } from './typeComment';
import { User } from './typeUser';
////////////////////////////////////////////////////////////////////////
export type ExpressHandler<ReqParams, Req, Res> = RequestHandler<
	ReqParams,
	Partial<Res>,
	Partial<Req>,
	any
>;

export type partialPost = Pick<Post, 'title' | 'url' | 'userid'>;
export type partialLike = Pick<Like, 'postid' | 'userid'>;
export type partialComment = Pick<Comment, 'comment' | 'postid' | 'userid'>;
export type partialUser = Pick<
	User,
	'firstname' | 'lastname' | 'username' | 'email' | 'password'
>;
export type returnedUser = Pick<
	User,
	| 'id'
	| 'firstname'
	| 'lastname'
	| 'username'
	| 'email'
	| 'password'
	| 'reset_code_expire'
>;
////////////////////////////////////////////////////////////////////////
// Posts Api
export interface ListPostReq {}
export interface ListPostRes {
	status: string;
	count: number;
	data: { rows: Post[] };
}

export type createPostReq = partialPost;
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

export interface DeletePostReq {}
export interface DeletePostRes {}
////////////////////////////////////////////////////////////////////////
// Likes Api
export type CreateLikeReq = partialLike;
export interface CreateLikeRes {
	status: string;
	message?: string;
	data?: { like: Like };
}
////////////////////////////////////////////////////////////////////////
// Comments Api

export type CreateCommentReq = partialComment;
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

////////////////////////////////////////////////////////////////////////
// Auth Api
// signup , login , protect , forget password , reset password , update password

// export type SignUpReq = partialUser;
export type SignUpReq = partialUser;

export interface SignUpRes {
	status: string;
	message?: string;
	data: {
		token: string;
		user: returnedUser;
	};
}

export type LoginReq = Pick<User, 'email' | 'password'>;
export interface LoginRes {
	status: string;
	message?: string;
	token: string;
}
export interface protectReq {
	user?: number;
}

export interface decodedJwt {
	id: number;
	iat: number;
	exp: number;
}

export interface CustomRequest extends Request {
	user?: number | string; // or the specific type you want for user
}

export type forgetPasswordReq = Pick<User, 'email'>;
export type resetPasswordReq = Pick<User, 'reset_code' | 'password'>;
export interface changePasswordReq {
	password: string;
	newPassword: string;
}
