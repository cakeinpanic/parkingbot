'use strict';

const slack = require('slack');
const _ = require('lodash');
const config = require('./config');
const SLOTS = require('./slots');
const PRIVATE_RESPONSE = require('./commands/help').PRIVATE_RESPONSE;

var http = require('http');
let bot = slack.rtm.client();

let PING_URL = config('PING_URL');
let CHANNELS = [];
const msgDefaults = {
    token: config('SLACK_TOKEN'),
    username: 'parkingbot',
    type: 'message',
    text: ''
};

bot.started(payload => {
    this.self = payload.self;
    slack.channels.list({token: config('SLACK_TOKEN')}, (err, data) => {
        CHANNELS = data.channels.map(channel => channel.id);
    });
});

function isItChannel(msg) {
    return CHANNELS.indexOf(msg.channel) > -1;
}

bot.message(msg => {
    console.log(msg);

    if (msg.subtype === 'message_replied'
        || msg.subtype === 'message_changed'
        || !msg.user
        || msg.text.indexOf('/') === 0) {
        return;
    }

    if (!isItChannel(msg)) {
        slack.chat.postMessage(
            _.defaults(
                {
                    channel: msg.channel,
                    attachments: JSON.stringify(PRIVATE_RESPONSE)
                },
                msgDefaults
            ),
            _.noop);
        return;
    }

    const changes = SLOTS.takeOrRemoveSlot(msg.text);

    if (!changes) {
        return;
    }

    var freeSLots = SLOTS.getFreeSots();

    slack.chat.postMessage(
        _.defaults(
            {
                channel: msg.channel,
                attachments: JSON.stringify([
                    {
                        title: freeSLots.length ? `Свободные места ${freeSLots.join(', ')}` : 'Свободных мест нет',
                        color: freeSLots.length ? config('FREE_COLOR') : config('ALL_TAKEN_COLOR'),
                        mrkdwn_in: ['text']
                    }
                ])
            },
            msgDefaults
        ), _.noop
    );

})
;

function startPing() {
    setInterval(function () {
        http.get(PING_URL);

        const hours = new Date().getUTCHours();

        console.log('ping ', hours);

        // in Russia its GMT+3
        if (hours === 21) {
            SLOTS.resetFreeSLOTS();
        }
    }, 300000);
}

module.exports = {bot, startPing};
