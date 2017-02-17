import * as supertest from 'supertest';
import { Response } from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import { sanitiseSchema } from 'nodejs-utils';
import { fmtError } from 'restify-errors';
import * as chaiJsonSchema from 'chai-json-schema';
import { cb } from '../../share_interfaces.d';
import { IEmailTplBase } from '../../../api/email_tpl/models.d';
import { User } from '../../../api/user/models';

const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const email_tpl_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class EmailTplTestSDK {
    constructor(public app) {
    }

    create(access_token: string, email_tpl: IEmailTplBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `create` must be defined'));
        else if (!email_tpl) return cb(new TypeError('`email_tpl` argument to `create` must be defined'));

        supertest(this.app)
            .post('/api/email_tpl')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(email_tpl)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(fmtError(res.error));

                try {
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(email_tpl_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            });
    }

    get(access_token: string, email_tpl: IEmailTplBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (!email_tpl) return cb(new TypeError('`email_tpl` argument to `getAll` must be defined'));

        supertest(this.app)
            .get(`/api/email_tpl/${email_tpl.createdAt}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.have.property('tpl');
                    expect(res.body.tpl).to.be.a('string');
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    update(access_token: string, initial_email_tpl: IEmailTplBase,
           updated_email_tpl: IEmailTplBase, cb: cb) {
        if (!access_token)
            return cb(new TypeError('`access_token` argument to `update` must be defined'));
        else if (!initial_email_tpl)
            return cb(new TypeError('`initial_email_tpl` argument to `update` must be defined'));
        else if (!updated_email_tpl)
            return cb(new TypeError('`updated_email_tpl` argument to `update` must be defined'));
        else if (initial_email_tpl.createdAt !== updated_email_tpl.createdAt)
            return cb(new ReferenceError(
                `${initial_email_tpl.createdAt} != ${updated_email_tpl.createdAt} (\`createdAt\`s between email_tpls)`)
            );

        supertest(this.app)
            .put(`/api/email_tpl/${initial_email_tpl.createdAt}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(updated_email_tpl)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    Object.keys(updated_email_tpl).map(
                        attr => expect(updated_email_tpl[attr]).to.be.equal(res.body[attr])
                    );
                    expect(res.body).to.be.jsonSchema(email_tpl_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    destroy(access_token: string, email_tpl: IEmailTplBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `destroy` must be defined'));
        else if (!email_tpl) return cb(new TypeError('`email_tpl` argument to `destroy` must be defined'));

        supertest(this.app)
            .del(`/api/email_tpl/${email_tpl.createdAt}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.status).to.be.equal(204);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }
}
