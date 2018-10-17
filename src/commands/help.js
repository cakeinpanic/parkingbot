'use strict'

const _ = require('lodash')
const config = require('../config')

const SLOTS = require('../slots');

const msgDefaults = {
    response_type: 'in_channel'
}

const handler = (payload, res) => {

    switch (payload.command) {
        case '/setslots':
            SLOTS.setSlots(payload.text);
            break;
        case '/addslot':
            SLOTS.addSlots(payload.text);
            break;
        case '/removeslot':
            SLOTS.removeSlots(payload.text);
            break;
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: [
            {
                title: 'Список доступных мест обновлен: ' + SLOTS.getAllSots().join(', '),
                color: config('ADD_COLOR'),
                mrkdwn_in: ['text']
            },
            {
                title: 'Свободные места: ' + SLOTS.getFreeSots().join(', '),
                color: config('FREE_COLOR'),
                mrkdwn_in: ['text']
            }
        ]
    }, msgDefaults);


    res.set('content-type', 'application/json')
    res.status(200).json(msg)

    return;
}

module.exports = {pattern: /help/ig, handler: handler}
