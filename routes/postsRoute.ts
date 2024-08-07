import { Router } from 'express';
import errHandle from 'express-async-handler';
const postsRouter = Router();
import {
	listPosts,
	createPost,
	getPost,
	deletePost,
} from '../controller/posts.controller';
import { protect } from '../middlewares/authProtection.middleware';
///////////////////////////////////////

postsRouter.get('/list', errHandle(listPosts));
postsRouter.post('/new', errHandle(protect), errHandle(createPost));
postsRouter.get('/:id', errHandle(getPost));
postsRouter.delete('/:id', errHandle(protect), errHandle(deletePost));
export { postsRouter };
