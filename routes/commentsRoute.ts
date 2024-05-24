import { Router } from 'express';
import errHandle from 'express-async-handler';
const commentsRouter = Router();
import {
	createComment,
	listComments,
	deleteComment,
} from '../controller/commentsController';
import { protect } from '../controller/authController';
commentsRouter.post('/new', errHandle(protect), errHandle(createComment));
commentsRouter.get('/list/:id', errHandle(listComments)); // id of the post
commentsRouter.delete('/:id', errHandle(protect), errHandle(deleteComment));
export { commentsRouter };
