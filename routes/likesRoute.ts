import { Router } from 'express';
import errHandle from 'express-async-handler';
import { addLike } from '../controller/likesController';
import { protect } from '../controller/authController';
const likesRouter = Router();
likesRouter.post('/new', errHandle(protect), errHandle(addLike));
export { likesRouter };
