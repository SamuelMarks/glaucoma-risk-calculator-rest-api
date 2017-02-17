import { IObjectCtor } from '../../../main';
import { IEmailTplBase } from '../../../api/email_tpl/models.d';

declare const Object: IObjectCtor;

export const email_tpl_mocks: {successes: Array<IEmailTplBase>, failures: Array<{}>} = {
    "failures": [
        {}, {tpl: ''}, {tpl: null}, {tpl: undefined}, {tpl: 0}
    ],
    "successes": [
        {tpl: 'foo', createdAt: new Date(Math.floor(Math.random() * 1000000000000) + 1).toISOString()},
        {tpl: 'bar', createdAt: new Date(Math.floor(Math.random() * 1000000000000) + 1).toISOString()},
        {tpl: 'can', createdAt: new Date(Math.floor(Math.random() * 1000000000000) + 1).toISOString()}
    ]
};

if (require.main === module) {
    console.info(email_tpl_mocks);
}
