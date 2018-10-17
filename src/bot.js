'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const SLOTS = require('./slots');

let bot = slack.rtm.client()

bot.started((payload) => {
    this.self = payload.self
})


bot.message((msg) => {
    if (!msg.user || msg.text.indexOf('/') === 0) return;

    const changes = SLOTS.takeOrRemoveSlot(msg.text);
    if (!changes) {
        return;
    }
    var freeSLots = SLOTS.getFreeSots();
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        channel: msg.channel,
        username: 'parkingbot',
        type: 'message',
        text: '',
        attachments: JSON.stringify([{
            title: freeSLots.length ? `Свободные места ${freeSLots.join(', ')}` : 'Свободных мест нет',
            color: freeSLots.length ? config('FREE_COLOR') : config('ALL_TAKEN_COLOR'),
            mrkdwn_in: ['text']
        }])
    }, (err, data) => {
        if (err) throw err

        let txt = _.truncate(data.message.text)

        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
});

module.exports = bot
