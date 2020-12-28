Hooks.on("init", function() {
  console.log("sdfsdfThis code runs once the Foundry VTT software begins it's initialization workflow.");
});

Hooks.on("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");
});


function Whisper() {
  ChatMessage.create({
    content: "This is a test",
    whisper: [game.users.find((u) => u.isGM)],
    speaker: ChatMessage.getSpeaker({ alias: "Twitch" })
  });
} 