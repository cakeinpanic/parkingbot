'use strict';

const slack = require('slack');

const _ = require('lodash');
const config = require('../config');
const SlotsStore = require('../slots-store');

const PRIVATE_RESPONSE = require('../slash-commands/slots-command').PRIVATE_RESPONSE;

let lastMessage = null;

const msgDefaults = {
    token: config.SLACK_TOKEN,
    username: 'parkingbot',
    type: 'message',
    text: ''
};

function isItChannel(msg) {
    const channelInfo = msg.channel[0];
    return channelInfo === 'C' || channelInfo === 'G';
}

function isItStatusMessage(msg) {
    // хак-костыль: название бота посылаем только в сообщении "места заняты", а когда послылаем другие сообщеня – не приписываем его
    return msg.subtype === 'bot_message' && msg.username === 'parkingbot';
}

function isMessageFromUser(msg) {
    return msg.user && msg.text.indexOf('/') !== 0
}


function handleMessage(msg) {
    if (msg.subtype === 'message_replied'
        || !!msg.thread_ts
        || msg.subtype === 'message_changed'
        || msg.subtype === 'message_deleted') {
        return;
    }

    console.log(msg);

    if (isItStatusMessage(msg) && isItChannel(msg)) {
        lastMessage = msg;
    }

    if (!isMessageFromUser(msg)) {
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

    const changes = SlotsStore.takeOrRemoveSlot(msg.text);
    const freeSLots = SlotsStore.getFreeSots();

    if (!changes) {
        return;
    }

    slack.chat.postMessage(
        _.defaults(
            {
                channel: msg.channel,
                attachments: JSON.stringify([
                    {
                        text: freeSLots.length ? `Свободные места ${freeSLots.join(', ')}` : 'Свободных мест нет',
                        color: freeSLots.length ? config.FREE_COLOR : config.ALL_TAKEN_COLOR,
                        mrkdwn_in: ['text']
                    }
                ])
            },
            msgDefaults
        ), _.noop
    );


    if (!!lastMessage) {
        slack.chat.delete(
            {
                token: config.SLACK_TOKEN,
                channel: msg.channel,
                ts: lastMessage.ts
            }, _.noop);
    }
}


module.exports = handleMessage;
