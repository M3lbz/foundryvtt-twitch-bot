import SimplePollForm from "./SimplePollForm.js";

export default class TwitchBotLayer extends CanvasLayer {
  constructor() {
    super();
    this.layername = "twitchbot";

    console.log("Twitch Bot | Drawing Layer | Loaded into Drawing Layer");
  }

  setButtons() {
    this.newButtons = {
      name: "TwitchBot",
      icon: "fas fa-gamepad",
      layer: "TwitchBotLayer",
      title: "Twitch Bot Controls",
      tools: [
        {
          icon: "fas fa-vote-yea",
          name: "NewVote",
          title: "New Vote",
          onClick: () => new SimplePollForm().render(true),
        },
        {
          icon: "fas fa-question-circle",
          name: "CoinFlip",
          title: "Start Coin Flip",
          onClick: () => TriggerVote("Heads or tails?", ["Heads 🍆", "Tails 🍑"]),
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
