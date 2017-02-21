import * as restify from 'restify';
import { Query, WLError } from 'waterline';
import { NotFoundError, fmtError } from 'restify-errors';
import { has_body, mk_valid_body_mw_ignore } from 'restify-validators';
import { JsonSchema } from 'tv4';
import { c } from '../../main';
import { has_auth } from '../auth/middleware';
import { IEmailTpl } from './models.d';

const email_tpl_schema: JsonSchema = require('./../../test/api/email_tpl/schema');

export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_auth(), has_body, mk_valid_body_mw_ignore(email_tpl_schema, ['createdAt']),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const EmailTpl: Query = c.collections['email_tpl_tbl'];

            EmailTpl.create(req.body).exec((error: WLError|Error, email_tpl: IEmailTpl) => {
                if (error) return next(fmtError(error));
                else if (!email_tpl) return next(new NotFoundError('EmailTpl'));
                res.json(201, email_tpl);
                return next();
            });
        }
    )
}
