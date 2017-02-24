import { IEmailConf } from './models.d';

export const EmailConf = {
    identity: 'email_conf_tbl',
    connection: 'main_db',
    _omit: [/*'uuid'*/],
    attributes: {
        client_id: {
            type: 'string',
            required: true
        },
        tenant_id: {
            type: 'string',
            required: true
        },
        id_token: {
            type: 'string'
        },
        access_token: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        session_state: {
            type: 'string'
        },
        from: {
            type: 'string'
        },
        toJSON: function toJSON() {
            let email_conf: IEmailConf = this.toObject();
            EmailConf._omit.map(k => delete email_conf[k]);
            for (const key in email_conf)
                if (email_conf.hasOwnProperty(key) && !email_conf[key]) delete email_conf[key];
            return email_conf;
        }
    }
};
