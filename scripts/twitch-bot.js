export const TwitchBot = {
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
