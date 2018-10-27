## Slack parking bot based on [starbot](https://github.com/mattcreager/starbot)

How it works: if your company has limited parking slots, workers can use slack channel to warn everyone which places are taken.
I have developed a bot to make it more comfortable

![before-after](https://pp.userapi.com/c831209/v831209961/1c75e2/4qKCjd3OpGo.jpg)


### NODE_ENV configs:
* STARBOT_COMMAND_TOKEN: slash commands token
* MAIN_CHANNEL: id of a parking channel
* SLACK_TOKEN: slack bot token
* PING_URL: url of slash command endpoint for app ping and taken slots resetting
* SLOTS_PRESET: default available slots [optional]
* TAKEN_PRESET: default taken slots [optional]