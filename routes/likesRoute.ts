import { Router } from 'express';
import errHandle from 'express-async-handler';
import { addLike } from '../controller/likes.controller';
import { protect } from '../middlewares/authProtection.middleware';

const likesRouter = Router();
likesRouter.post('/new', errHandle(protect), errHandle(addLike));
export { likesRouter };
