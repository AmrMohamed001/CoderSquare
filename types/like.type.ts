import { Like } from '../dtos/like.dto';

export type partialLike = Pick<Like, 'postid' | 'userid'>;
