import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { UserRepo } from '../repository/user.repository';
import { AppError } from '../utils/AppError';

import {
	forgetPasswordReq,
	partialUser,
	resetPasswordReq,
} from '../types/user.types';
import {
	SignUpRes,
	LoginReq,
	LoginRes,
	changePasswordReq,
	CustomRequest,
} from '../interfaces/user.interface';
import { ExpressHandler } from '../types/expressHandler.type';
import { MailSender } from '../utils/MailSender';
import { signToken } from '../utils/signToken';
import { StatusCodes } from '../enums/statusCodes.enum';
////////////////////////////////////////////////////////

export const signup: ExpressHandler<{}, partialUser, SignUpRes> = async (
	req,
	res,
	next
) => {
	const { firstname, lastname, username, email, password } = req.body;

	if (!firstname || !lastname || !username || !email || !password)
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'fill all fields please')
		);

	const hashedPassword = await bcryptjs.hash(password!, 12);
	const insertedUser = await UserRepo.insert({
		firstname,
		lastname,
		username,
		email,
		password: hashedPassword,
	});
	const token = signToken(insertedUser.id);
	insertedUser.password = undefined;
	res.status(StatusCodes.CREATED).json({
		status: 'success',
		data: {
			token,
			user: insertedUser,
		},
	});
};

const comparePasswords = async (plain: string, hash: string) => {
	return await bcryptjs.compare(plain, hash);
};

export const login: ExpressHandler<{}, LoginReq, LoginRes> = async (
	req,
	res,
	next
) => {
	const { email, password } = req.body;
	if (!email || !password)
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'email or password is missing')
		);

	const user = await UserRepo.findByEmail(email);

	if (!user || !(await comparePasswords(password, user.password!)))
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'email or password is not correct')
		);

	const token = signToken(user.id);
	res.status(StatusCodes.OK).json({
		status: 'success',
		token,
	});
};

export const forgetPassword: ExpressHandler<{}, forgetPasswordReq, {}> = async (
	req,
	res,
	next
) => {
	const { email } = req.body;
	if (!email)
		return next(
			new AppError(StatusCodes.NOT_FOUND, 'provide your mail please')
		);

	const user = await UserRepo.findByEmail(email);
	if (!user)
		return next(
			new AppError(StatusCodes.NOT_FOUND, 'no user found with this mail')
		);

	const pin = Math.floor(100000 + Math.random() * 900000).toString();
	const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');
	const pinExpire = (Date.now() + 10 * 60 * 1000).toString();

	await UserRepo.findByIdAndUpdate(user.id, {
		reset_code: hashedPin,
		reset_code_expire: pinExpire,
	});

	try {
		await new MailSender(user, pin).sendResetPassword();
		res.status(StatusCodes.OK).json({
			status: 'success',
			message: 'email was sent.',
		});
	} catch (err) {
		console.log(err);
		await UserRepo.findByIdAndUpdate(user.id, {
			reset_code: null,
			reset_code_expire: null,
		});
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'failed',
			message: 'stmp problem , try again',
		});
	}
};

export const resetPassword: ExpressHandler<{}, resetPasswordReq, {}> = async (
	req,
	res,
	next
) => {
	const { reset_code: code } = req.body;
	if (!code)
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'provide reset code please')
		);
	const encryptedCode = crypto.createHash('sha256').update(code).digest('hex');
	const user = await UserRepo.findByCode(encryptedCode);
	if (!user || Date.now() > +user.reset_code_expire)
		return next(
			new AppError(
				StatusCodes.BAD_REQUEST,
				'wrong code or time expired , try again'
			)
		);

	const { password } = req.body;

	const hashed = await bcryptjs.hash(password!, 12);

	const passwordChangedat = Date.now().toString();
	await UserRepo.findByIdAndUpdate(user.id, {
		password: hashed,
		password_changed_at: passwordChangedat,
		reset_code: null,
		reset_code_expire: null,
	});
	res.status(StatusCodes.OK).json({
		status: 'success',
		message: 'password changed',
	});
};

export const changePassword: ExpressHandler<
	{},
	changePasswordReq,
	LoginRes
> = async (req: CustomRequest, res, next) => {
	const { password, newPassword } = req.body;

	if (!password || !newPassword)
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'fill all fields please')
		);
	const user = await UserRepo.findById(Number(req.user));
	if (!user)
		return next(new AppError(StatusCodes.BAD_REQUEST, 'no user found'));

	if (!(await comparePasswords(password, user.password!)))
		return next(
			new AppError(StatusCodes.BAD_REQUEST, 'wrong password , try again')
		);

	const hashedPassword = await bcryptjs.hash(newPassword, 12);
	await UserRepo.findByIdAndUpdate(user.id, {
		password: hashedPassword,
		password_changed_at: Date.now().toString(),
	});
	const token = signToken(user.id);
	res.status(StatusCodes.OK).json({
		status: 'success',
		token,
	});
};
