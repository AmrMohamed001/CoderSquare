import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
	changePasswordReq,
	CustomRequest,
	decodedJwt,
	ExpressHandler,
	forgetPasswordReq,
	LoginReq,
	LoginRes,
	partialUser,
	protectReq,
	resetPasswordReq,
	SignUpReq,
	SignUpRes,
} from '../types/typeApi';
import { UserRepo } from '../repos/user-repo';
import { AppError } from '../utils/AppError';
import { Request } from 'express';
import { Email } from '../utils/sendMail';
////////////////////////////////////////////////////////

export const signup: ExpressHandler<{}, SignUpReq, SignUpRes> = async (
	req,
	res,
	next
) => {
	const { firstname, lastname, username, email, password } = req.body;

	if (!firstname || !lastname || !username || !email || !password)
		return next(new AppError(400, 'fill all fields please'));

	const hashedPassword = await bcryptjs.hash(password!, 12);
	const user = await UserRepo.insert({
		firstname,
		lastname,
		username,
		email,
		password: hashedPassword,
	});
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: '30d',
	});
	user.password = undefined;
	res.status(201).json({
		status: 'success',
		data: {
			token,
			user,
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
	//1
	const { email, password } = req.body;
	if (!email || !password)
		return next(new AppError(400, 'email or password is missing'));

	// 2
	const user = await UserRepo.findByEmail(email);

	if (!user || !(await comparePasswords(password, user.password!)))
		return next(new AppError(400, 'email or password is not correct'));

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: '30d',
	});
	res.status(202).json({
		status: 'success',
		token,
	});
};
const afterJwtIssued = (doc: any, jwtTimeStamp: number): boolean => {
	if (doc.passwordChangedat) {
		console.log(doc.passwordChangedat.getTime() / 1000);
		return doc.passwordChangedat.getTime() / 1000 > jwtTimeStamp;
	}

	return false;
};

export const protect: ExpressHandler<{}, {}, {}> = async (
	req: CustomRequest,
	res,
	next
) => {
	let token: string | undefined;
	// 1- get token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	)
		token = req.headers.authorization.split(' ')[1];
	if (!token) return next(new AppError(400, 'No token found'));

	// 2- verify token
	const decoded = jwt.verify(token, process.env.JWT_SECRET!) as decodedJwt;
	// console.log(decoded);

	// 3- check user is still exist
	const user = await UserRepo.findById(decoded.id);

	if (!user) return next(new AppError(402, 'No user found'));

	// 4- check if user changed password after token is issued
	// console.log(user);
	if (afterJwtIssued(user, decoded.iat))
		return next(new AppError(401, 'user change password , login again'));
	req.user = user.id;
	next();
};

const generatePinCode = () => {
	const pin = Math.floor(100000 + Math.random() * 900000).toString();
	const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');
	const pinExpire = new Date(Date.now() + 10 * 60 * 1000);
	return pin;
};

export const forgetPassword: ExpressHandler<{}, forgetPasswordReq, {}> = async (
	req,
	res,
	next
) => {
	const { email } = req.body;
	if (!email) return next(new AppError(400, 'provide your mail please'));

	const user = await UserRepo.findByEmail(email);
	if (!user) return next(new AppError(400, 'no user found with this mail'));

	// generate code
	const pin = Math.floor(100000 + Math.random() * 900000).toString();
	const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');
	const pinExpire = (Date.now() + 10 * 60 * 1000).toString();

	console.log(pin, typeof pinExpire);
	// pin string , hash string

	// add to db
	await UserRepo.findByIdAndUpdate(user.id, {
		reset_code: hashedPin, //string
		reset_code_expire: pinExpire, //string
	});

	// send mail
	try {
		await new Email(user, pin).sendResetPassword();
		res.status(200).json({
			status: 'success',
			message: 'email was sent.',
		});
	} catch (err) {
		console.log(err);
		await UserRepo.findByIdAndUpdate(user.id, {
			reset_code: null,
			reset_code_expire: null,
		});
		res.status(500).json({
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
	// get code and check it
	const { reset_code: code } = req.body;
	if (!code) return next(new AppError(400, 'provide reset code please'));
	// encrypt it and get user based on this code and check time is valid or not
	const encryptedCode = crypto.createHash('sha256').update(code).digest('hex');
	const user = await UserRepo.findByCode(encryptedCode);
	if (!user || Date.now() > +user.reset_code_expire)
		return next(new AppError(400, 'wrong code or time expired , try again'));

	// update password
	const { password } = req.body;

	const hashed = await bcryptjs.hash(password!, 12);

	const passwordChangedat = Date.now().toString();
	await UserRepo.findByIdAndUpdate(user.id, {
		password: hashed,
		password_changed_at: passwordChangedat,
		reset_code: null,
		reset_code_expire: null,
	});
	res.status(200).json({
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
		return next(new AppError(400, 'fill all fields please'));
	const user = await UserRepo.findById(req.user as number);
	if (!user) return next(new AppError(400, 'no user found'));
	// compare passwords
	if (!(await comparePasswords(password, user.password!)))
		return next(new AppError(400, 'wrong password , try again'));
	// update password
	const hashedPassword = await bcryptjs.hash(newPassword, 12);
	await UserRepo.findByIdAndUpdate(user.id, {
		password: hashedPassword,
		password_changed_at: Date.now().toString(),
	});
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: '30d',
	});
	res.status(200).json({
		status: 'success',
		token,
	});
};
