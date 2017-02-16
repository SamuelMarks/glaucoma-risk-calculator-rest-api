import * as supertest from 'supertest';
import { Response } from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import { sanitiseSchema } from 'nodejs-utils';
import { fmtError } from 'restify-errors';
import * as chaiJsonSchema from 'chai-json-schema';
import { cb } from '../../share_interfaces.d';
import { IContactBase } from '../../../api/contact/models.d';
import { User } from '../../../api/user/models';

const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const contact_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class AddressBookTestSDK {
    constructor(public app) {
    }

    create(access_token: string, contact: IContactBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `create` must be defined'));
        else if (!contact) return cb(new TypeError('`contact` argument to `create` must be defined'));

        supertest(this.app)
            .post('/api/contact')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(contact)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(fmtError(res.error));

                try {
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(contact_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            });
    }

    getAll(access_token: string, contact: IContactBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (!contact) return cb(new TypeError('`contact` argument to `getAll` must be defined'));

        supertest(this.app)
            .get('/api/contact')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.have.property('owner');
                    expect(res.body).to.have.property('contacts');
                    expect(res.body.contacts).to.be.instanceOf(Array);
                    res.body.contacts.map(contact => {
                        expect(contact).to.be.an('object');
                        expect(contact).to.be.jsonSchema(contact_schema);
                    });
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    retrieve(access_token: string, contact: IContactBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (!contact) return cb(new TypeError('`contact` argument to `getAll` must be defined'));

        supertest(this.app)
            .get(`/api/contact/${contact.email}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(contact_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    update(access_token: string, initial_contact: IContactBase,
           updated_contact: IContactBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `update` must be defined'));
        else if (!initial_contact) return cb(new TypeError('`initial_contact` argument to `update` must be defined'));
        else if (!updated_contact) return cb(new TypeError('`updated_contact` argument to `update` must be defined'));
        else if (initial_contact.owner !== updated_contact.owner)
            return cb(new ReferenceError(`${initial_contact.owner} != ${updated_contact.owner} (\`owner\`s between contacts)`));

        supertest(this.app)
            .put(`/api/contact/${initial_contact.email}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(updated_contact)
            .end((err, res: Response) => {
                if (err) return cb(err);
                else if (res.error) return cb(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    Object.keys(updated_contact).map(
                        attr => expect(updated_contact[attr]).to.be.equal(res.body[attr])
                    );
                    expect(res.body).to.be.jsonSchema(contact_schema);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    destroy(access_token: string, contact: IContactBase, cb: cb) {
        if (!access_token) return cb(new TypeError('`access_token` argument to `destroy` must be defined'));
        else if (!contact) return cb(new TypeError('`contact` argument to `destroy` must be defined'));

        supertest(this.app)
            .del(`/api/contact/${contact.email}`)
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
