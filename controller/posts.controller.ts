import { pool } from '../config/databaseConfig';
import { StatusCodes } from '../enums/statusCodes.enum';
import {
	ListPostRes,
	CreatePostRes,
	GetPostReq,
	GetPostRes,
} from '../interfaces/post.interface';
import { CustomRequest } from '../interfaces/user.interface';
import { LikeRepo } from '../repository/like.repository';
import { PostRepo } from '../repository/post.repository';
import { ExpressHandler } from '../types/expressHandler.type';
import { partialPost } from '../types/post.type';
import { ApiQueryBuilder } from '../utils/ApiQueryBuilder';
import { AppError } from '../utils/AppError';

////////////////////////////////////////////////////////
export const listPosts: ExpressHandler<{}, {}, ListPostRes> = async (
	req,
	res,
	next
) => {
	let features = new ApiQueryBuilder(req.query)
		.filter()
		.sort()
		.select()
		.paginate()
		.search(['title']);
	let query = features.buildQuery('posts');
	const { rows } = await pool.query(query);
	if (rows.length === 0)
		return next(new AppError(StatusCodes.BAD_REQUEST, 'results not found'));
	let rowsCount = rows.length;

	res.status(StatusCodes.OK).json({
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
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'fill required fields please')
		);
	const post = await PostRepo.insert(req.body as partialPost);

	res.status(StatusCodes.OK).json({
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
	if (!post) return next(new AppError(StatusCodes.NOT_FOUND, 'Post not found'));
	const postLikes = await LikeRepo.getLikesCount(post.id);
	console.log(postLikes);

	res.status(StatusCodes.OK).json({
		status: 'success',
		data: { post, likes: postLikes },
	});
};
export const deletePost: ExpressHandler<{ id: string }, {}, {}> = async (
	req: CustomRequest,
	res,
	next
) => {
	const post = await PostRepo.findAndDelete(req.params.id);
	if (post?.userid !== req.user)
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'not your post to delete')
		);
	if (!post) return next(new AppError(StatusCodes.NOT_FOUND, 'Post not found'));
	res.sendStatus(StatusCodes.NO_CONTENT);
};
