'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const helpCommand = require('./slash-commands/slots-command').handler;

let handleMessage = require('./bot-logic/bot');
let startPing = require('./ping');

const slack = require('slack');
let bot = slack.rtm.client();

bot.message(handleMessage);

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Привет, я отвечаю за парковочного бота!');
});

app.post('/commands/starbot', (req, res) => {
    let payload = req.body;

    if (!payload || payload.token !== config.STARBOT_COMMAND_TOKEN) {
        return;
    }

    helpCommand(payload, res)
});

app.listen(config.PORT, err => {
    if (err) throw err;

    console.log(`\n🚀  Parkingbot lives on PORT ${config.PORT} 🚀`);

    if (config.SLACK_TOKEN) {
        console.log(`connected to RTM`);
        bot.listen({token: config.SLACK_TOKEN});
    }
});

startPing();
