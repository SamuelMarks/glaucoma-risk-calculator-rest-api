import * as redis from 'redis';
import { Collection, Connection } from 'waterline';
import * as waterline_postgres from 'waterline-postgresql';
import { createLogger } from 'bunyan';
import { Server } from 'restify';
import { uri_to_config, populateModelRoutes, IModelRoute } from 'nodejs-utils';
import { strapFramework, IStrapFramework } from 'restify-utils';
import { SampleData } from './test/SampleData';

export const package_ = require('./package');
export const logger = createLogger({
    name: 'main'
});

process.env['NO_DEBUG'] || logger.info(Object.keys(process.env).sort().map(k => ({[k]: process.env[k]})));

export interface IObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

declare const Object: IObjectCtor;

// Database waterline_config
const db_uri: string = process.env['RDBMS_URI'] || process.env['DATABASE_URL'] || process.env['POSTGRES_URL'];


export const waterline_config = Object.freeze({
    /* TODO: Put this all in tiered environment-variable powered .json file */
    adapters: {
        url: db_uri,
        postgres: waterline_postgres
    },
    defaults: {
        migrate: 'create'
    },
    connections: {
        postgres: {
            adapter: 'postgres',
            connection: uri_to_config(db_uri),
            pool: {
                min: 2,
                max: 20
            }
        }
    }
});

export const all_models_and_routes: IModelRoute = populateModelRoutes('.');

export const redis_cursors: {redis: redis.RedisClient} = {
    redis: null
};

export const c: {collections: Collection[], connections: Connection[]} = {collections: [], connections: []};

let _cache = {};

export const strapFrameworkKwargs: IStrapFramework = Object.freeze(<IStrapFramework>{
    app_name: package_.name,
    models_and_routes: all_models_and_routes,
    logger: logger,
    _cache: _cache,
    package_: package_,
    root: '/api',
    skip_db: false,
    collections: c.collections,
    waterline_config: waterline_config,
    use_redis: true,
    redis_cursors: redis_cursors,
    createSampleData: true,
    SampleData: SampleData,
    sampleDataToCreate: (sampleData: any) => [
        cb => sampleData.unregister(cb),
        cb => sampleData.registerLogin(cb)
    ]
});

if (require.main === module) {
    strapFramework(Object.assign({
        start_app: true, callback: (err, _app: Server, _connections: Connection[], _collections: Collection[]) => {
            if (err) throw err;
            c.collections = _collections
        }
    }, strapFrameworkKwargs));
}
