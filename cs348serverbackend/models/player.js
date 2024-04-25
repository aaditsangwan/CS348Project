const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  team_name: String,
  age: Number,
  player_id: String,
  number: Number,
});

playerSchema.index({ team_name: 1 });

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
