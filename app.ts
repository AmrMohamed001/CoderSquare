import express, { Request } from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { AppError } from './utils/AppError';
import { postsRouter } from './routes/postsRoute';
import { likesRouter } from './routes/likesRoute';
import { commentsRouter } from './routes/commentsRoute';
import { userRouter } from './routes/usersRoute';
import * as swaggerDocument from './swagger.json';
import { globalErrorHandling } from './middlewares/errorHandling.middleware';
///////////////////////////////////////////////
const app = express();
app.use(cors());
app.options('*', cors());
app.set('trust proxy', true);
app.use(compression());
app.use(express.json({ limit: '100kb' }));

app.use(logger('dev'));
const keyGenerator = (req: any) => req.ip;
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	keyGenerator,
	message: 'too many requests from this ip .. try again after 15 minute',
});

app.use('/api', limiter);
app.use(hpp());
////////////////////////////////////////////////////
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);
app.use('/auth', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.all('*', (req, res, next) => {
	return next(new AppError(404, 'this route is not defined'));
});
app.use(globalErrorHandling);
export { app };
