import * as restify from 'restify';
import { waterfall } from 'async';
import { Query, WLError } from 'waterline';
import { has_body, mk_valid_body_mw, mk_valid_body_mw_ignore } from 'restify-validators';
import { NotFoundError, fmtError } from 'restify-errors';
import { JsonSchema } from 'tv4';
import { c } from '../../main';
import { has_auth } from './../auth/middleware';
import { IContact, IContactBase } from './models.d';


const contact_schema: JsonSchema = require('./../../test/api/contact/schema');

export function read(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:email`, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: Query = c.collections['contact_tbl'];

            Contact.findOne({owner: req['user_id'], email: req.params.email}
            ).exec((error: WLError, contact: IContact) => {
                if (error) return next(fmtError(error));
                else if (!contact) return next(new NotFoundError('Contact'));
                res.json(contact);
                return next();
            });
        }
    );
}

export function update(app: restify.Server, namespace: string = ""): void {
    app.put(`${namespace}/:email`, has_body, mk_valid_body_mw(contact_schema, false),
        mk_valid_body_mw_ignore(contact_schema, ['Missing required property']), has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: Query = c.collections['contact_tbl'];

            // TODO: Transaction
            waterfall([
                cb => Contact.findOne({owner: req['user_id'], email: req.params.email}
                ).exec((err: WLError, contact: IContact) => {
                    if (err) return cb(err);
                    else if (!contact) return cb(new NotFoundError('Contact'));
                    return cb(err, contact)
                }),
                (contact: IContactBase, cb) =>
                    Contact.update(contact, req.body, (e, contacts: IContact[]) => cb(e, contacts[0]))
            ], (error, contact: IContact) => {
                if (error) return next(fmtError(error));
                res.json(200, contact);
                return next()
            });
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}/:email`, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: Query = c.collections['contact_tbl'];

            Contact.destroy({owner: req['user_id'], email: req.params.email}).exec((error: WLError) => {
                if (error) return next(fmtError(error));
                res.send(204);
                return next();
            });
        }
    );
}
