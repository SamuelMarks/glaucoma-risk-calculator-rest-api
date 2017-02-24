import { Model, Record } from 'waterline';

export interface IEmailConf extends Model, Record {
    id?: number;
    updatedAt: Date;
}

export interface IEmailConfBase {
    state?: string;
    id_token?: string;
    access_token?: string;
    from?: string;
    session_state?: string;
    client_id: string;
    tenant_id: string;
}
