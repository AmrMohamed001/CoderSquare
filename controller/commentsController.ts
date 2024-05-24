import { CommentRepo } from '../repos/comment-repo';
import {
	CreateCommentReq,
	CreateCommentRes,
	CustomRequest,
	DeleteCommentReq,
	DeleteCommentRes,
	ExpressHandler,
	ListCommentsReq,
	ListCommentsRes,
	partialComment,
} from '../types/typeApi';
import { AppError } from '../utils/AppError';

export const createComment: ExpressHandler<
	{},
	CreateCommentReq,
	CreateCommentRes
> = async (req: CustomRequest, res, next) => {
	req.body.userid = req.user;
	const comment = await CommentRepo.insert(req.body as partialComment);
	res.status(201).json({
		status: 'success',
		data: { comment },
	});
};
export const listComments: ExpressHandler<
	{ id: string },
	ListCommentsReq,
	ListCommentsRes
> = async (req, res, next) => {
	const comments = await CommentRepo.find(req.params.id);
	if (!comments)
		return next(new AppError(404, 'No comments found for this post'));
	res.status(200).json({
		status: 'success',
		data: { comments },
	});
};
export const deleteComment: ExpressHandler<
	{ id: string },
	DeleteCommentReq,
	DeleteCommentRes
> = async (req: CustomRequest, res, next) => {
	const comment = await CommentRepo.findByIdAndDelete(req.params.id);
	if (comment?.userid !== req.user)
		return next(new AppError(400, 'not your comment to delete'));
	if (!comment)
		return next(new AppError(404, 'No comment found with this id,try again'));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};
