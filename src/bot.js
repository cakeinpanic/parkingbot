'use strict';

const slack = require('slack');
const _ = require('lodash');
const config = require('./config');
const SLOTS = require('./slots');
const PRIVATE_RESPONSE = require('./commands/help').PRIVATE_RESPONSE;

var http = require('http');

let LAST_CHANNEL = null;
let bot = slack.rtm.client();
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
    if (!msg.user || msg.text.indexOf('/') === 0) {
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
            )
        );
        return;
    }

    const changes = SLOTS.takeOrRemoveSlot(msg.text);

    if (!changes) {
        return;
    }

    var freeSLots = SLOTS.getFreeSots();
    LAST_CHANNEL = msg.channel;

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
        ),
        (err, data) => {
            if (err) throw err;

            let txt = _.truncate(data.message.text);

            console.log(`🤖  beep boop: I responded with "${txt}"`);
        }
    );
});

function startPing() {
    setInterval(function() {
        http.get('http://cakeinpanictest.herokuapp.com');
        console.log('ping');
        const hours = new Date().getUTCHours();

        // in Russia its GMT+3
        if (hours === 20) {
            if (SLOTS.resetFreeSLOTS() && LAST_CHANNEL) {
                slack.chat.postMessage(
                    _.defaults(
                        {
                            channel: LAST_CHANNEL,
                            attachments: JSON.stringify([
                                {
                                    title: `Занятые места сброшены. Свободные места ${SLOTS.getFreeSots().join(', ')}`,
                                    color: config('FREE_COLOR'),
                                    mrkdwn_in: ['text']
                                }
                            ])
                        },
                        msgDefaults
                    ),
                    err => {
                        if (err) throw err;
                    }
                );
            }
        }
    }, 300000);
}

module.exports = {bot, startPing};
