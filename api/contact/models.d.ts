import {Model, Record} from 'waterline';

export interface IContact extends Model, Record, IContactBase {
}

export interface IContactBase {
    name?: string;
    email: string;
    owner: string;
}
