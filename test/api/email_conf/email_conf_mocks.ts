import { IObjectCtor } from '../../../main';
import { IEmailConfBase } from '../../../api/email_conf/models.d';


declare const Object: IObjectCtor;

export const email_conf_mocks: {successes: Array<IEmailConfBase>, failures: Array<{}>} = {
    "failures": [
        {}, {client_id: 0, tenant_id: ''}, {client_id: '', tenant_id: ''}
    ],
    "successes": [
        {client_id: 'foo', tenant_id: 'bar'},
        {client_id: 'can', tenant_id: 'haz'}
    ]
};

if (require.main === module) {
    console.info(email_conf_mocks);
}
