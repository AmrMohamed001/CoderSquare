import { LikeRepo } from '../repos/like-repo';
import {
	ExpressHandler,
	CreateLikeReq,
	CreateLikeRes,
	partialLike,
	CustomRequest,
} from '../types/typeApi';
export const addLike: ExpressHandler<{}, CreateLikeReq, CreateLikeRes> = async (
	req: CustomRequest,
	res,
	next
) => {
	req.body.userid = req.user;
	const like = await LikeRepo.insert(req.body as partialLike);

	res.status(201).json({
		status: 'success',
		data: { like },
	});
};
