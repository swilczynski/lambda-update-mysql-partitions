'use strict';

const app = require('./index');

(async () => {
    await app.handler(null);
})().then(() => {
    process.exit()
});