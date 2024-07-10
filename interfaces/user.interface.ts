import { User } from '../dtos/user.dto';
import { returnedUser } from '../types/user.types';
import { Request } from 'express';
export interface CustomRequest extends Request {
	user?: string;
}
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

export interface changePasswordReq {
	password: string;
	newPassword: string;
}
