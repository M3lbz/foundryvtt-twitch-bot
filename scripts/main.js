Hooks.on("init", function() {
  game.settings.register("foundry-twitch-bot", "twitchBotChannelNames", {
    name: "Player Channel Names",
    hint: "Comma delimited list of channels you would like to monitor the chat for. e.g. \"channel1,channel2\"",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

Hooks.on("ready", function() {
  //if we are not the game master do not make the connection
  if (!game.user.isGM) return

  // Set up twitch chat reader
  game.twitchClient = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: game.settings.get('foundry-twitch-bot', 'twitchBotChannelNames').split(',').map((c) => c.trim())
  });  

  game.twitchClient.connect().catch(console.error);
  game.twitchClient.on('message', (channel, tags, message, self) => {
    WhisperGM(`<b>${tags['display-name']}</b>: ${message} <i>(${channel})</i>`);
  });
});


function WhisperGM(content) {
  ChatMessage.create({
    content: content,
    whisper: [game.users.find((u) => u.isGM)],
    speaker: ChatMessage.getSpeaker({ alias: "Twitch" })
  });
} 