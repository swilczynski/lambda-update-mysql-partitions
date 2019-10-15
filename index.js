'use strict';

const moment = require('moment-timezone');
const mysql = require('serverless-mysql');

const Di = require('./app/di');

const PartitionsRepository = require('./app/model/partition/PartitionsRepository');
const RequestsRepository = require('./app/model/requests/RequestsRepository');
const InboxRepository = require('./app/model/inbox/InboxRepository');

const ProcessPartitionsCommand = require('./app/command/ProcessPartitionsCommand');

const config = require('./app/config/' + (process.env.MACHINE_ID || 'production'));

console.log('Environment: ', process.env.MACHINE_ID);

moment.tz.setDefault('America/New_York');

exports.handler = async (event) => {
    for (let i = 0; i < config.databases.length; i++) {
        const database = config.databases[i];

        console.log(`Processing database: ${database.name}@${database.credentials.host}`);

        const db = mysql({
            config: database.credentials
        });

        const di = new Di();

        di.set('PartitionsRepository', new PartitionsRepository(db));
        di.set('RequestsRepository', new RequestsRepository(db));
        di.set('InboxRepository', new InboxRepository(db));

        await new ProcessPartitionsCommand(di).execute(database);
    }

    return {
        status: 'Ok'
    };
}
