'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

let bot = slack.rtm.client()

bot.started((payload) => {
    this.self = payload.self
})

function getSlotsFromMessage(text, reg) {
    let result = reg.exec(text);
    let slots = [];
    while(result) {
        slots.push(result[1]);
        result = reg.exec(text);
    }
    return slots;
}

bot.message((msg) => {
    if (!msg.user || msg.text.indexOf('/') === 0) return;

    const takeSlot = getSlotsFromMessage(msg.text, /([\d.]+)/g);
    const removeSlot = getSlotsFromMessage(msg.text, /(-[\d.]+)/g);

    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'Starbot',
        type: 'message',
        text: '',
        attachments: JSON.stringify([ {
            title: `Свободные места take ${takeSlot} leave ${removeSlot}`,
            color: '#2FA44F',
            mrkdwn_in: ['text']
        }])
    }, (err, data) => {
        if (err) throw err

        let txt = _.truncate(data.message.text)

        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
});

module.exports = bot
