import { Router } from 'express';
import {
	changePassword,
	forgetPassword,
	login,
	resetPassword,
	signup,
	protect,
} from '../controller/authController';
import errHandle from 'express-async-handler';
const userRouter = Router();

userRouter.post('/signup', errHandle(signup));
userRouter.post('/login', errHandle(login));
userRouter.post('/forget-password', errHandle(forgetPassword));
userRouter.post('/reset-password', errHandle(resetPassword));
userRouter.post(
	'/change-password',
	errHandle(protect),
	errHandle(changePassword)
);
export { userRouter };
