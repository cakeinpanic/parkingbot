'use strict';

const dotenv = require('dotenv');
const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') dotenv.load();

const config = {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    PROXY_URI: process.env.PROXY_URI,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    STARBOT_COMMAND_TOKEN: process.env.STARBOT_COMMAND_TOKEN,
    SLACK_TOKEN: process.env.SLACK_TOKEN,
    ADD_COLOR: '#608fa4',
    FREE_COLOR: '#2FA44F',
    ALL_TAKEN_COLOR: '#a42823',
    TAKEN_PRESET: process.env.TAKEN_PRESET,
    SLOTS_PRESET: process.env.SLOTS_PRESET,
    PING_URL: process.env.PING_URL,
    MAIN_CHANNEL: process.env.MAIN_CHANNEL
};

module.exports = key => {
    if (!key) return config;

    return config[key];
};
