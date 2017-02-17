import { IEmailTpl } from './models.d';

export const EmailTpl = {
    identity: 'email_tpl_tbl',
    connection: 'main_db',
    _omit: [/*'uuid'*/],
    attributes: {
        tpl: {
            type: 'string',
            required: true
        },
        toJSON: function toJSON() {
            let email_tpl: IEmailTpl = this.toObject();
            EmailTpl._omit.map(k => delete email_tpl[k]);
            for (const key in email_tpl)
                if (email_tpl.hasOwnProperty(key) && !email_tpl[key]) delete email_tpl[key];
            return email_tpl;
        }
    }
};
