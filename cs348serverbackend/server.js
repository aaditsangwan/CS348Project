// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const playersController = require("./controllers/playersController");
const teamsController = require("./controllers/teamsController");

// Create express app
const app = express();

// Connect to database
connectToDb();

// Configure express app
app.use(express.json());
app.use(cors());

// Routing
// players
app.get("/players", playersController.fetchPlayers);

app.get("/players/:id", playersController.fetchPlayer);

app.post("/players", playersController.createPlayer);

app.put("/players/:id", playersController.updatePlayer);

app.delete("/players/:id", playersController.deletePlayer);

// teams
app.get("/teams", teamsController.fetchTeams);
app.get("/teams/:id", teamsController.fetchTeam);
app.post("/teams", teamsController.createTeam);
app.put("/teams/:id", teamsController.updateTeam);
app.delete("/teams/:id", teamsController.deleteTeam);
app.get("/teams/name/:name", teamsController.getTeamByName);

// Start our server
app.listen(process.env.PORT);
