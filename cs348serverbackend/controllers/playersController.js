const Player = require("../models/player");

const fetchPlayers = async (req, res) => {
  // Find players
  const players = await Player.find();
  // Respond with them
  res.json({ players });
};

const fetchPlayer = async (req, res) => {
  // Get id off url
  const playerId = req.params.id;

  // Find player with id
  const player = await Player.findById(playerId);

  // Respond with the player
  res.json({ player });
};

const createPlayer = async (req, res) => {
  // Get the sent in data off request body
  const name = req.body.name;
  const position = req.body.position;
  const team_name = req.body.team_name;
  const age = req.body.age;
  const player_id = req.body.player_id;
  const number = req.body.number;

  // Create a player with it
  const player = await Player.create({
    name,
    position,
    team_name,
    age,
    player_id,
    number,
  });

  // Respond with the new player
  res.json({ player });
};

const updatePlayer = async (req, res) => {
  // Get the id off the url
  const playerId = req.params.id;

  // Get the new data off the request body
  const name = req.body.name;
  const position = req.body.position;
  const team_name = req.body.team_name;
  const age = req.body.age;
  const player_id = req.body.player_id;
  const number = req.body.number;

  // Find and update the record
  await Player.findByIdAndUpdate(playerId, {
    name,
    position,
    team_name,
    age,
    player_id,
    number,
  });

  // Find update player

  const player = await Player.findById(playerId);

  // Respond with it
  res.json({ player });
};

const deletePlayer = async (req, res) => {
  // get id off url
  const playerId = req.params.id;

  // delete record
  await Player.deleteOne({ _id: playerId });

  // respond
  res.json({ success: "Record deleted" });
};

module.exports = {
  fetchPlayers,
  fetchPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
