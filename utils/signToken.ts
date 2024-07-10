import jwt from 'jsonwebtoken';
export const signToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET!, {
		expiresIn: '30d',
	});
};
