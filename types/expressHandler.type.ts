import { RequestHandler, Request } from 'express';

export type ExpressHandler<ReqParams, Req, Res> = RequestHandler<
	ReqParams,
	Partial<Res>,
	Partial<Req>,
	any
>;
