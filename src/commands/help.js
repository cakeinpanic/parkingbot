
'use strict'

const _ = require('lodash')
const config = require('../config')

let slots = [];

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Starbot',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Starbot will help you find the hippest repos on GitHub',
    color: '#2FA44F',
    text: '`/starbot repos` returns hip repos \n`/starbot javascript` returns hip JavaScript repos',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring Starbot',
    color: '#E3E4E6',
    text: '`/starbot help` ... you\'re lookin at it! \n',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, res) => {

  switch (payload.command) {
      case '/setslots': slots = payload.text.replace(' ', '').split(','); break;
      case '/addslot': slots.push(payload.text.replace(' ', '')); break;
  }

    let msg = _.defaults({
        channel: payload.channel_name,
        text: 'Список доступных мест: ' +slots.join(',')
    }, msgDefaults);



  res.set('content-type', 'application/json')
  res.status(200).json(msg)

    return;
}

module.exports = { pattern: /help/ig, handler: handler }
