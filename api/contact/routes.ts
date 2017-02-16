import * as restify from 'restify';
import { Query, WLError } from 'waterline';
import { NotFoundError, fmtError } from 'restify-errors';
import { has_body, mk_valid_body_mw } from 'restify-validators';
import { JsonSchema } from 'tv4';
import { c } from '../../main';
import { has_auth } from '../auth/middleware';
import { IContact } from './models.d';

const contact_schema: JsonSchema = require('./../../test/api/contact/schema');

export function create(app: restify.Server, namespace: string = ""): void {
    function add_owner_mw(req: restify.Request, res: restify.Response, next: restify.Next) {
        req.body.owner = req['user_id'];
        return next();
    }

    app.post(namespace, has_auth(), has_body, add_owner_mw, mk_valid_body_mw(contact_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: Query = c.collections['contact_tbl'];

            Contact.create(req.body).exec((error: WLError|Error, contact: IContact) => {
                if (error) return next(fmtError(error));
                else if (!contact) return next(new NotFoundError('Contact'));
                res.json(201, contact);
                return next();
            });
        }
    )
}

export function read(app: restify.Server, namespace: string = ""): void {
    app.get(namespace, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: Query = c.collections['contact_tbl'];

            Contact.find({owner: req['user_id']}, (error: WLError, contacts: IContact[]) => {
                if (error) return next(fmtError(error));
                else if (!contacts) return next(new NotFoundError('Contact'));
                res.json({contacts: contacts, owner: req['user_id']});
                return next();
            });
        }
    );
}
