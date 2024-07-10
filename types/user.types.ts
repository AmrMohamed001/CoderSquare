import { User } from '../dtos/user.dto';

export type partialUser = Pick<
	User,
	'firstname' | 'lastname' | 'username' | 'email' | 'password'
>;
export type returnedUser = Pick<
	User,
	| 'id'
	| 'firstname'
	| 'lastname'
	| 'username'
	| 'email'
	| 'password'
	| 'reset_code_expire'
>;

export type forgetPasswordReq = Pick<User, 'email'>;
export type resetPasswordReq = Pick<User, 'reset_code' | 'password'>;
