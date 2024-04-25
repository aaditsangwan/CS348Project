const Team = require("../models/team");
const Player = require("../models/player");

const fetchTeams = async (req, res) => {
  // Find players
  const teams = await Team.find();
  // Respond with them
  res.json({ teams });
};

const fetchTeam = async (req, res) => {
  // Get id off url
  const teamId = req.params.id;

  // Find player with id
  const team = await Team.findById(teamId);

  // Respond with the player
  res.json({ team });
};

const createTeam = async (req, res) => {
  // Get the sent in data off request body
  const team_name = req.body.team_name;
  const team_id = req.body.team_id;
  const division = req.body.division;
  const conference = req.body.conference;

  // Create a player with it
  const team = await Team.create({
    team_name,
    team_id,
    division,
    conference,
  });

  // Respond with the new player
  res.json({ team });
};

const updateTeam = async (req, res) => {
  // Get the id off the url
  const teamId = req.params.id;

  // Get the new data off the request body
  const team_name = req.body.team_name;
  const team_id = req.body.team_id;
  const division = req.body.division;
  const conference = req.body.conference;

  // Find the team before updating
  const oldTeam = await Team.findById(teamId);

  // Find and update the record
  await Team.findByIdAndUpdate(teamId, {
    team_name,
    team_id,
    division,
    conference,
  });

  // Find update team
  const team = await Team.findById(teamId);

  // Update all players with the old team_name
  await Player.updateMany(
    { team_name: oldTeam.team_name },
    { $set: { team_name: team.team_name } }
  );

  // Respond with it
  res.json({ team });
};

const deleteTeam = async (req, res) => {
  // get id off url
  const teamId = req.params.id;

  // find the team
  const team = await Team.findById(teamId);

  // delete the team record
  await Team.deleteOne({ _id: teamId });

  // delete all players with the same team_name
  await Player.deleteMany({ team_name: team.team_name });

  // respond
  res.json({ success: "Team and associated players deleted" });
};

const getTeamByName = async (req, res) => {
  const teamName = req.params.name;
  const team = await Team.findOne({ team_name: teamName });
  const teamExists = team ? true : false;
  res.json({ teamExists });
};

module.exports = {
  fetchTeams,
  fetchTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamByName,
};
