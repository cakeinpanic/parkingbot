
'use strict'

const _ = require('lodash')
const config = require('../config')

let SLOTS = [];

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

function getSlotsFromMessage(text) {
  const reg =/([\d.]+)/g;
  let result = reg.exec(text);
  let slots = [];
  while(result) {
    slots.push(result[0]);
    result = reg.exec(text);
  }
  return slots;
}

function removeSlots(text) {
    const slotsToRemove = getSlotsFromMessage(text);
    slotsToRemove.forEach(slot=>{
        SLOTS.splice(SLOTS.indexOf(slot),1);
    })
}

function addSlots(text) {
    const slotsToAdd = getSlotsFromMessage(text);
    SLOTS = SLOTS.concat(slotsToAdd).filter((s,i) => SLOTS.indexOf(s) === i)
}

const handler = (payload, res) => {

  switch (payload.command) {
      case '/setslots': SLOTS = getSlotsFromMessage(payload.text); break;
      case '/addslot': addSlots(payload.text); break;
      case '/removeslot': removeSlots(payload.text); break;
  }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: [ {
            title: 'Список доступных мест обновлен',
            color: '#2FA44F',
            text:  SLOTS.join(', '),
            mrkdwn_in: ['text']
        }]
    }, msgDefaults);


  res.set('content-type', 'application/json')
  res.status(200).json(msg)

    return;
}

module.exports = { pattern: /help/ig, handler: handler }
