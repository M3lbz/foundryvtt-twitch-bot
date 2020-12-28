Hooks.on('init', function() {
  game.settings.register('foundry-twitch-bot', 'twitchBotChannelNames', {
    name: 'Player Channel Names',
    hint: 'Comma delimited list of channels you would like to monitor the chat for. e.g. \'channel1,channel2\' (requires refresh)',
    scope: 'world',
    config: true,
    type: String,
    default: ''
  });
});


Hooks.on('ready', function() {
 console.log('TwitchBot');
 console.log(TwitchBot);

  // Set up twitch chat reader
  TwitchBot.client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: game.settings.get('foundry-twitch-bot', 'twitchBotChannelNames').split(',').map((c) => c.trim())
  });  

  TwitchBot.client.connect().catch(console.error);

  TwitchBot.client.on('message', (channel, tags, message, self) => {
      //if we are not the game master do not send the whisper
      if (game.user.isGM) {
        WhisperGM(`<b>${tags['display-name']}</b>: ${message} <i>(${channel})</i>`);
        
        if (TwitchBot.votingIsOn && /^\d+$/.test(message)) {
          Vote(tags.username, message);
        }
      } 
  });
});

window.TwitchBot = {
  client: null,
  votingIsOn: false,
  voteTopic: "",
  options: {},
  voters: {},
};

window.WhisperGM = (content) => {
  ChatMessage.create({
    content: content,
    whisper: [game.users.find((u) => u.isGM)],
    speaker: ChatMessage.getSpeaker({ alias: 'Twitch' })
  });
}

window.TriggerVote = (name, data) => {
  console.log('TriggerVote');
  TwitchBot.voteTopic = name;
  TwitchBot.voters = {};
  TwitchBot.votingIsOn = true;
  TwitchBot.options = {};

  for (let i; i < data.length; i++) {
    TwitchBot.options[data.length[i]] = 0;
  }
}

window.Vote = (name, vote) => {
    const optionsAsArray = Object.keys(TwitchBot.options);
    
    // Ignore invalid votes
    if(vote > optionsAsArray.length) return;

    const voteAsIndex = vote - 1;
    const hasVoted = !!(TwitchBot.voters[name] || TwitchBot.voters[name] === 0);

    // If the user has voted before, remove their previous vote
    if(hasVoted) {
      TwitchBot.options[optionsAsArray[TwitchBot.voters[name]]] -= 1;
    }

    // Record user's vote and add a vote to the option
    TwitchBot.voters[name] = voteAsIndex;
    TwitchBot.options[optionsAsArray[voteAsIndex]] += 1;
  }

  window.EndVote = () => {
  TwitchBot.votingIsOn = false;
  TwitchBot.options = {};
}