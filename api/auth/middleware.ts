import * as restify from 'restify';
import { GenericError } from 'restify-errors';
import { AccessToken } from './models';

export function has_auth(scope = 'login') {
    return (req: restify.Request, res: restify.Response, next: restify.Next) => {
        if (req.params.access_token)
            req.headers['x-access-token'] = req.params.access_token;

        if (!req.headers['x-access-token'])
            return next(new GenericError({
                statusCode: 403,
                error: 'NotFound',
                error_message: 'X-Access-Token header must be included'
            }));

        AccessToken().findOne(
            req.headers['x-access-token'], (err, user_id) => {
                if (err) return next(err);
                else if (!user_id) return next(new GenericError({
                    statusCode: 403,
                    error: 'NotFound',
                    error_message: 'Invalid access token used'
                }));
                req['user_id'] = user_id;
                return next()
            }
        );
    }
}
