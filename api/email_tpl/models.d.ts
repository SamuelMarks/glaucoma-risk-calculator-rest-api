import { Model } from 'waterline';

export interface IEmailTpl extends Model, IEmailTplBase {
    id?: number;
    updatedAt: Date;
}

export interface IEmailTplBase {
    tpl?: string;
    createdAt: Date|string;
}
