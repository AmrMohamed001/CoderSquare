import { Post } from '../dtos/post.dto';

export type partialPost = Pick<Post, 'title' | 'url' | 'userid'>;
