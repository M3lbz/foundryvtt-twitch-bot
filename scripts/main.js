class TwitchBotLayer extends CanvasLayer {
  constructor() {
    super();
    this.layername = "twitchbot";

    console.log("Twitch Bot | Drawing Layer | Loaded into Drawing Layer");
  }

  setButtons() {
    this.newButtons = {
      name: "TwitchBot",
      icon: "fas fa-wrench",
      layer: "TwitchBotLayer",
      title: "Twitch Bot Controls",
      tools: [
        {
          icon: "fas fas fa-vote-yea",
          name: "TriggerVote",
          title: "Trigger Vote",
          onClick: () =>
            TriggerVote("What is next?", [
              "Goblin Attack",
              "A Gift From God",
              "They All Argue for 20 mins",
            ]),
        },
        {
          icon: "fas fa-hand-paper",
          name: "EndVote",
          title: "End Vote",
          onClick: () => EndVote(),
        },
      ],
    };
  }

  newHookTest() {
    Hooks.on("getSceneControlButtons", (controls) => {
      console.log("Twitch Bot | Testing User role = " + game.user.data.role);
      if (game.user.data.role == 4) {
        controls.push(this.newButtons);
      }
    });
  }
}

Hooks.once("canvasInit", () => {
  // Add TwitchBotLayer to canvas
  const layerct = canvas.stage.children.length;
  let tbLayer = new TwitchBotLayer();

  tbLayer.setButtons();
  tbLayer.newHookTest();
  canvas.twitchBot = canvas.stage.addChildAt(tbLayer, layerct);
  canvas.twitchBot.draw();

  let theLayers = Canvas.layers;
  theLayers.twitchBot = TwitchBotLayer;

  Object.defineProperty(Canvas, 'layers', {get: function() {
      return theLayers
  }})
});

Hooks.on("init", function () {
  game.settings.register("foundry-twitch-bot", "twitchBotChannelNames", {
    name: "Player Channel Names",
    hint:
      "Comma delimited list of channels you would like to monitor the chat for. e.g. 'channel1,channel2' (requires refresh)",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });
});

Hooks.on("ready", function () {
  console.log("TwitchBot");
  console.log(TwitchBot);

  // Set up twitch chat reader
  TwitchBot.client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: game.settings
      .get("foundry-twitch-bot", "twitchBotChannelNames")
      .split(",")
      .map((c) => c.trim()),
  });

  TwitchBot.client.connect().catch(console.error);

  TwitchBot.client.on("message", (channel, tags, message, self) => {
    //if we are not the game master do not send the whisper
    if (game.user.isGM) {
      WhisperGM(
        `<b>${tags["display-name"]}</b>: ${message} <i>(${channel})</i>`
      );

      if (TwitchBot.votingIsOn && /^\d+$/.test(message)) {
        Vote(tags.username, message);
      }
    }
  });
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (game.user.data.role == 4) {
    controls.push();
  }
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
    speaker: ChatMessage.getSpeaker({ alias: "Twitch" }),
  });
};

window.TriggerVote = (name, data) => {
  console.log("TriggerVote");
  TwitchBot.voteTopic = name;
  TwitchBot.voters = {};
  TwitchBot.votingIsOn = true;
  TwitchBot.options = {};

  for (let i = 0; i < data.length; i++) {
    TwitchBot.options[data[i]] = 0;
  }

  WhisperGM(`
    <h1>${TwitchBot.voteTopic}</h1>
    </br>
    <ol>${data.map((opt) => `<li>${opt}</li>`).join("")}</ol>
    `);
};

window.Vote = (name, vote) => {
  const optionsAsArray = Object.keys(TwitchBot.options);

  // Ignore invalid votes
  if (vote > optionsAsArray.length) return;

  const voteAsIndex = vote - 1;
  const hasVoted = !!(TwitchBot.voters[name] || TwitchBot.voters[name] === 0);

  // If the user has voted before, remove their previous vote
  if (hasVoted) {
    TwitchBot.options[optionsAsArray[TwitchBot.voters[name]]] -= 1;
  }

  // Record user's vote and add a vote to the option
  TwitchBot.voters[name] = voteAsIndex;
  TwitchBot.options[optionsAsArray[voteAsIndex]] += 1;
};

window.EndVote = () => {
  if (TwitchBot.votingIsOn) {
    const winner = Object.entries(TwitchBot.options).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const voteCount = TwitchBot.options[winner];

    WhisperGM(
      `<h1>
      ${TwitchBot.voteTopic}
      </h1>
      </br> THE WINNER IS: ${winner} with ${voteCount} vote${
        voteCount > 1 ? "s" : ""
      }! 👏👏👏`
    );
  } else {
    WhisperGM(`There is no active vote!`);
  }
  TwitchBot.votingIsOn = false;
  TwitchBot.options = {};
};
