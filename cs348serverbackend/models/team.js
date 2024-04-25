const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  team_name: String,
  team_id: String,
  division: String,
  conference: String,
});

teamSchema.index({ division: 1, conference: 1 });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
