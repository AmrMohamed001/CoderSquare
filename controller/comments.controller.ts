import { StatusCodes } from '../enums/statusCodes.enum';
import {
	CreateCommentRes,
	ListCommentsReq,
	ListCommentsRes,
	DeleteCommentReq,
	DeleteCommentRes,
} from '../interfaces/comment.interface';
import { CustomRequest } from '../interfaces/user.interface';
import { CommentRepo } from '../repository/comment.repository';
import { partialComment } from '../types/comment.type';
import { ExpressHandler } from '../types/expressHandler.type';

import { AppError } from '../utils/AppError';

export const createComment: ExpressHandler<
	{},
	partialComment,
	CreateCommentRes
> = async (req: CustomRequest, res, next) => {
	req.body.userid = String(req.user);
	const comment = await CommentRepo.insert(req.body as partialComment);
	res.status(StatusCodes.CREATED).json({
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
		return next(
			new AppError(StatusCodes.NOT_FOUND, 'No comments found for this post')
		);
	res.status(StatusCodes.OK).json({
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
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'not your comment to delete')
		);
	if (!comment)
		return next(
			new AppError(
				StatusCodes.NOT_FOUND,
				'No comment found with this id,try again'
			)
		);
	res.status(StatusCodes.NO_CONTENT).json({
		status: 'success',
		data: null,
	});
};
