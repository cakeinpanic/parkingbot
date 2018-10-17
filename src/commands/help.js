'use strict'

const _ = require('lodash')
const config = require('../config')

const SLOTS = require('../slots');

const help = `/setslots – полностью перезаписать доступные места
/addslots – добавить доступные места 
/removeslots – убрать доступные места 
Чтобы занять место, просто укажите его номер, чтобы освободить – номер с минусом.
Каждый день в полночь писок свободных мест обновляется`;

const msgDefaults = {
    response_type: 'in_channel'
}

const handler = (payload, res) => {

    if (payload.command === '/howtopark') {
        var attachments =  [
            {
                title: 'Инструкция по парковке :blue_car:',
                color: config('ADD_COLOR'),
                text: help,
                mrkdwn_in: ['text']
            }
        ];
        sendMessage(payload, res, attachments);
        return;
    }

    if(payload.channel_name === 'directmessage') {
        return;
    }

    switch (payload.command) {
        case '/setslots':
            SLOTS.setSlots(payload.text);
            break;
        case '/addslots':
            SLOTS.addSlots(payload.text);
            break;
        case '/removeslots':
            SLOTS.removeSlots(payload.text);
            break;
    }

    sendMessage(payload, res,  [
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
    ]);

}

function sendMessage(payload, res, attachments) {
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments
    }, msgDefaults);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)

}
module.exports = {pattern: /help/ig, handler: handler}
