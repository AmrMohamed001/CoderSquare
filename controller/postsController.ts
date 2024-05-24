import { pool } from '../config/databaseConfig';
import { LikeRepo } from '../repos/like-repo';
import { PostRepo } from '../repos/post-repo';
import {
	createPostReq,
	CreatePostRes,
	CustomRequest,
	DeletePostReq,
	DeletePostRes,
	ExpressHandler,
	GetPostReq,
	GetPostRes,
	ListPostReq,
	ListPostRes,
	partialPost,
} from '../types/typeApi';
import { Api } from '../utils/Api';
import { AppError } from '../utils/AppError';

////////////////////////////////////////////////////////
export const listPosts: ExpressHandler<{}, {}, ListPostRes> = async (
	req: CustomRequest,
	res,
	next
) => {
	let features = new Api(req.query)
		.filter()
		.sort()
		.select()
		.pagination()
		.search(['title']);
	let query = features.buildQuery('posts');
	const { rows } = await pool.query(query);
	if (rows.length === 0) return next(new AppError(400, 'results not found'));
	let rowsCount = rows.length;
	// console.log(api.query);

	res.status(200).json({
		status: 'success',
		count: rowsCount,

		data: { rows },
	});
};

export const createPost: ExpressHandler<
	{},
	partialPost,
	CreatePostRes
> = async (req: CustomRequest, res, next) => {
	req.body.userid = req.user;
	if (!req.body.title || !req.body.url || !req.body.userid)
		return next(new AppError(400, 'fill required fields please'));
	const post = await PostRepo.insert(req.body as partialPost);

	res.status(200).json({
		status: 'success',
		data: { post },
	});
};
export const getPost: ExpressHandler<
	{ id: string },
	GetPostReq,
	GetPostRes
> = async (req, res, next) => {
	const { id } = req.params;
	const post = await PostRepo.findById(id);
	if (!post) return next(new AppError(404, 'Post not found'));
	const postLikes = await LikeRepo.getLikesCount(post.id);
	console.log(postLikes);

	res.status(200).json({
		status: 'success',
		data: { post, likes: postLikes },
	});
};
export const deletePost: ExpressHandler<
	{ id: string },
	DeletePostReq,
	DeletePostRes
> = async (req: CustomRequest, res, next) => {
	const post = await PostRepo.findAndDelete(req.params.id);
	if (post?.userid !== req.user)
		return next(new AppError(400, 'not your post to delete'));
	if (!post) return next(new AppError(404, 'Post not found'));
	res.sendStatus(204);
};
