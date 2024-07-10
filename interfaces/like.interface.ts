import { Like } from '../dtos/like.dto';

export interface CreateLikeRes {
	status: string;
	message?: string;
	data?: { like: Like };
}
