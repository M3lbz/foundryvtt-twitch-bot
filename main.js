import TwitchBotLayer from "./classes/TwitchBotLayer.js";
import { TwitchBot } from "./scripts/twitch-bot.js";

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

  Object.defineProperty(Canvas, "layers", {
    get: function () {
      return theLayers;
    },
  });
});

Hooks.on("init", function () {
  // Set up Settings
  game.settings.register("foundry-twitch-bot", "twitchBotChannelNames", {
    name: "Player Channel Names",
    hint:
      "Comma delimited list of channels you would like to monitor the chat for. e.g. 'channel1,channel2' (requires refresh)",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });
  
  game.settings.register("foundry-twitch-bot", "twitchBotAllChatMessages", {
    name: "Whisper All Chats",
    hint:
      "Check this box to send all chats from all channels to the GM",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
});

Hooks.on("ready", function () {
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
    console.log(game.settings.get("foundry-twitch-bot", "twitchBotAllChatMessages"));
    if (game.user.isGM && game.settings.get("foundry-twitch-bot", "twitchBotAllChatMessages")) {
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
