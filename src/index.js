'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./commands');
const helpCommand = require('./commands/help');

let bot = require('./bot').bot;
let startPing = require('./bot').startPing;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Привет, я отвечаю за парковочного бота!');
});

app.post('/commands/starbot', (req, res) => {
    let payload = req.body;

    if (!payload || payload.token !== config('STARBOT_COMMAND_TOKEN')) {
        return;
    }

    let cmd = _.reduce(
        commands,
        (a, cmd) => {
            return payload.text.match(cmd.pattern) ? cmd : a;
        },
        helpCommand
    );

    cmd.handler(payload, res);
});

app.listen(config('PORT'), err => {
    if (err) throw err;

    console.log(`\n🚀  Starbot LIVES on PORT ${config('PORT')} 🚀`);

    if (config('SLACK_TOKEN')) {
        console.log(`🤖  beep boop: @starbot is real-time\n`);
        bot.listen({token: config('SLACK_TOKEN')});
    }
});

startPing();
