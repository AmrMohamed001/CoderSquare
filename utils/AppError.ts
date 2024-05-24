export class AppError extends Error {
	public status: string;
	public isOperational: boolean;
	constructor(public statusCode: number, public message: string) {
		super(message);
		this.status = `${statusCode}`.startsWith('4') ? 'error' : 'failed';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}
