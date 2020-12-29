export default class TwitchBotLayer extends CanvasLayer {
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