# Twitch-Bot #
This is a module for Foundryvtt that enables the monitoring of twitch channels. We assume that there is only one GM and they act as the central 'server' for monitoring.

## Configuration ##
- ` Player Channel Names` - Comma delimited list of channels you would like to monitor the chat for. e.g. 'channel1,channel2'.
- `Whisper All Chats` - Check this box to send all chats from all channels to the GM.

## Features ##
### Chat
All chats from any monitored twich channel are whispered to the GM. (Soon to be toggleable)

### Polls
Set up Polls by creating a macro with the wollowing:
``` Javascript
// TriggerVote(pollname, arrayOfOptions)
TriggerVote('What is next?', ['Goblin Attack', 'Delivery from God', 'They All Argue for 20 mins'])
```

Polls are ended with the following Macro:
``` Javascript
EndVote()
```

### GM Actions
![GM Buttons](https://bitbucket.org/Melbz/foundryvtt-twitch-bot/raw/master/img/GM%20Buttons.jpg)


## License
- This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).
- This work is licensed under the [Foundry Virtual Tabletop EULA - Limited License Agreement for Module Development](https://foundryvtt.com/article/license/).

### Bugs
- View current known bugs in the [Issue Tracker Backlog](https://bitbucket.org/Melbz/foundryvtt-twitch-bot/issues?status=new&status=open)
- Log new bugs in the [Issue Tracker](https://bitbucket.org/Melbz/foundryvtt-twitch-bot/issues/new)