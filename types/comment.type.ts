import { Comment } from '../dtos/comment.dto';

export type partialComment = Pick<Comment, 'comment' | 'postid' | 'userid'>;
