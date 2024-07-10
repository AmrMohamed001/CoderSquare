import { Response, NextFunction } from 'express'; // Add this import
import { CustomRequest, decodedJwt } from '../interfaces/user.interface';
import { UserRepo } from '../repository/user.repository';
import { ExpressHandler } from '../types/expressHandler.type';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';

const hasUserChangedPassword = (doc: any, jwtTimeStamp: number): boolean => {
	if (doc.passwordChangedat) {
		console.log(doc.passwordChangedat.getTime() / 1000);
		return doc.passwordChangedat.getTime() / 1000 > jwtTimeStamp;
	}

	return false;
};

export const protect: ExpressHandler<{}, {}, {}> = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	let token: string | undefined;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	)
		token = req.headers.authorization.split(' ')[1];
	if (!token) return next(new AppError(400, 'No token found'));

	const decoded = jwt.verify(token, process.env.JWT_SECRET!) as decodedJwt;

	const user = await UserRepo.findById(decoded.id);

	if (!user) return next(new AppError(402, 'No user found'));

	if (hasUserChangedPassword(user, decoded.iat))
		return next(new AppError(401, 'user change password , login again'));

	req.user = user.id;
	next();
};
