import * as restify from 'restify';

export function body_date_to_s(req: restify.Request, res: restify.Response, next: restify.Next) {
    req.body.createdAt = new Date(req.body.createdAt).toISOString();
    return next();
}
