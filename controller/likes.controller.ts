import { StatusCodes } from '../enums/statusCodes.enum';
import { CreateLikeRes } from '../interfaces/like.interface';
import { CustomRequest } from '../interfaces/user.interface';
import { LikeRepo } from '../repository/like.repository';
import { ExpressHandler } from '../types/expressHandler.type';
import { partialLike } from '../types/like.type';

export const addLike: ExpressHandler<{}, partialLike, CreateLikeRes> = async (
	req: CustomRequest,
	res,
	next
) => {
	req.body.userid = String(req.user);
	const like = await LikeRepo.insert(req.body as partialLike);

	res.status(StatusCodes.CREATED).json({
		status: 'success',
		data: { like },
	});
};
