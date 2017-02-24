import * as supertest from 'supertest';
import { Response } from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import { sanitiseSchema } from 'nodejs-utils';
import { fmtError } from 'restify-errors';
import * as chaiJsonSchema from 'chai-json-schema';
import { cb } from '../../share_interfaces.d';
import { IEmailConfBase } from '../../../api/email_conf/models.d';
import { User } from '../../../api/user/models';

const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const email_conf_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class EmailConfTestSDK {
    constructor(public app) {
    }

    create(access_token: string, email_conf: IEmailConfBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `create` must be defined'));
        else if (!email_conf) return cb(new TypeError('`email_conf` argument to `create` must be defined'));

        supertest(this.app)
            .post('/api/email_conf')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(email_conf)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(fmtError(res.error));

                try {
                    expect(res.status).to.be.above(199);
                    expect(res.status).to.be.below(202);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(email_conf_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            });
    }

    get(access_token: string, email_conf: IEmailConfBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (!email_conf) return cb(new TypeError('`email_conf` argument to `getAll` must be defined'));

        supertest(this.app)
            .get('/api/email_conf')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.be.jsonSchema(email_conf_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }
}
