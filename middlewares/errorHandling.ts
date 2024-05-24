import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
///////////////////////////////////////////////////////
// todo : fix any
function sendErrorDev(err: any, res: any) {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
}

function sendErrorProd(err: any, res: any) {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.log(err);
		res.status(err.statusCode).json({
			status: err.status,
			message: 'something went wrong , try again',
		});
	}
}
function handleDuplicateKey(err: any) {
	let message = `${err.detail.split('=')[0]} already exists,try again.`;
	return new AppError(400, message);
}
function handleCastIdError(err: any) {
	let message = `invalid id , enter valid id please`;
	return new AppError(400, message);
}
function handleNotPresentError(err: any) {
	let message = err.detail.split('in')[0];
	return new AppError(400, message);
}

function handleJsonWebTokenError() {
	return new AppError(402, 'invalid token');
}
////////////////////////////////////////////
export const globalErrorHandling: ErrorRequestHandler = (
	err,
	req,
	res,
	next
) => {
	err.statusCode ||= 500;
	err.status ||= 'server error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let errCopy = { ...err };
		errCopy.message = err.message;
		if (err.code === '23505') errCopy = handleDuplicateKey(errCopy);
		if (err.code === '22P02') errCopy = handleCastIdError(errCopy);
		if (err.code === '23503') errCopy = handleNotPresentError(errCopy);
		if (err.name === 'JsonWebTokenError') errCopy = handleJsonWebTokenError();
		sendErrorProd(errCopy, res);
	}
};
