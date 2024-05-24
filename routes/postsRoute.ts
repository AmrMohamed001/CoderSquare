import { Router } from 'express';
import errHandle from 'express-async-handler';
const postsRouter = Router();
import {
	listPosts,
	createPost,
	getPost,
	deletePost,
} from '../controller/postsController';
import { protect } from '../controller/authController';
///////////////////////////////////////

postsRouter.get('/list', errHandle(listPosts));
postsRouter.post('/new', errHandle(protect), errHandle(createPost));
postsRouter.get('/:id', errHandle(getPost));
postsRouter.delete('/:id', errHandle(protect), errHandle(deletePost));
export { postsRouter };
