import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  //state
  const [players, setPlayers] = useState(null);
  const [teams, setTeams] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    position: "",
    team_name: "",
    age: "",
    player_id: "",
    number: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    name: "",
    position: "",
    team_name: "",
    age: "",
    player_id: "",
    number: "",
  });

  const [createTeamForm, setCreateTeamForm] = useState({
    team_name: "",
    team_id: "",
    division: "",
    conference: "",
  });
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);

  const [updateTeamForm, setUpdateTeamForm] = useState({
    _id: null,
    team_name: "",
    team_id: "",
    division: "",
    conference: "",
  });

  const [filterByTeamName, setFilterByTeamName] = useState("");
  const [filterByDivision, setFilterByDivision] = useState("");
  const [filterByConference, setFilterByConference] = useState("");

  const uniqueTeamNames = Array.from(
    new Set(players?.map((player) => player.team_name))
  );
  const uniqueDivisions = Array.from(
    new Set(teams?.map((team) => team.division))
  );
  const uniqueConferences = Array.from(
    new Set(teams?.map((team) => team.conference))
  );

  const filteredPlayers = players?.filter((player) => {
    if (filterByTeamName && player.team_name !== filterByTeamName) return false;
    if (filterByDivision) {
      const team = teams?.find((team) => team.team_name === player.team_name);
      if (team && team.division !== filterByDivision) return false;
    }
    if (filterByConference) {
      const team = teams?.find((team) => team.team_name === player.team_name);
      if (team && team.conference !== filterByConference) return false;
    }
    return true;
  });

  // use effect
  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  // Functions
  const fetchPlayers = async () => {
    // fetch players
    const res = await axios.get("http://localhost:3000/players");
    // set to state
    setPlayers(res.data.players);
  };

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:3000/teams");
    setTeams(res.data.teams);
  };

  const updateCreateFormFeild = (e) => {
    const { name, value } = e.target;

    setCreateForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createPlayer = async (e) => {
    e.preventDefault();

    const res = await axios.get(
      `http://localhost:3000/teams/name/${createForm.team_name}`
    );
    const teamExists = res.data.teamExists;

    if (!teamExists) {
      // Team doesn't exist, prompt user to create a new team
      setCreateTeamForm({
        team_name: createForm.team_name,
        team_id: "",
        division: "",
        conference: "",
      });
      setShowCreateTeamForm(true);
    } else {
      // Create the player
      const res = await axios.post("http://localhost:3000/players", createForm);

      // Update state
      setPlayers((prevState) => [...prevState, res.data.player]);

      // Clear form state
      setCreateForm({
        name: "",
        position: "",
        team_name: "",
        age: "",
        player_id: "",
        number: "",
      });
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();

    // Create the team
    const res = await axios.post("http://localhost:3000/teams", createTeamForm);

    // Close the create team form
    setShowCreateTeamForm(false);

    // Create the player
    const playerRes = await axios.post(
      "http://localhost:3000/players",
      createForm
    );

    // Update state
    setPlayers((prevState) => [...prevState, playerRes.data.player]);
    setTeams((prevState) => [...prevState, res.data.team]);

    // Clear form state
    setCreateForm({
      name: "",
      position: "",
      team_name: "",
      age: "",
      player_id: "",
      number: "",
    });
  };

  const deletePlayer = async (_id) => {
    // Delete Player
    await axios.delete("http://localhost:3000/players/" + _id);

    // Update State
    const newPlayers = [...players].filter((player) => {
      return player._id !== _id;
    });

    setPlayers(newPlayers);
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleUpdate = (player) => {
    // Set state on update form
    setUpdateForm({
      name: player.name,
      position: player.position,
      team_name: player.team_name,
      age: player.age,
      player_id: player.player_id,
      number: player.number,
      _id: player._id,
    });
  };

  const updatePlayer = async (e) => {
    e.preventDefault();

    const { name, position, team_name, age, player_id, number } = updateForm;

    // send the update request
    const res = await axios.put(
      "http://localhost:3000/players/" + updateForm._id,
      {
        name,
        position,
        team_name,
        age,
        player_id,
        number,
      }
    );

    // update state
    const newPlayers = [...players];
    const playerIndex = players.findIndex((player) => {
      return player._id === updateForm._id;
    });

    newPlayers[playerIndex] = res.data.player;

    setPlayers(newPlayers);

    // Clear update form state
    setUpdateForm({
      _id: null,
      name: "",
      position: "",
      team_name: "",
      age: "",
      player_id: "",
      number: "",
    });
  };

  const handleUpdateTeamFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateTeamForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleUpdateTeam = (team) => {
    setUpdateTeamForm({
      _id: team._id,
      team_name: team.team_name,
      team_id: team.team_id,
      division: team.division,
      conference: team.conference,
    });
  };

  const updateTeam = async (e) => {
    e.preventDefault();

    const { team_name, team_id, division, conference } = updateTeamForm;

    const res = await axios.put(
      `http://localhost:3000/teams/${updateTeamForm._id}`,
      {
        team_name,
        team_id,
        division,
        conference,
      }
    );

    const newTeams = [...teams];
    const teamIndex = teams.findIndex(
      (team) => team._id === updateTeamForm._id
    );
    newTeams[teamIndex] = res.data.team;

    setTeams(newTeams);

    // Update players with the new team details
    const updatedPlayers = players.map((player) => {
      if (player.team_name === updateTeamForm.team_name) {
        return {
          ...player,
          team_name: res.data.team.team_name,
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);

    setUpdateTeamForm({
      _id: null,
      team_name: "",
      team_id: "",
      division: "",
      conference: "",
    });
  };

  const deleteTeam = async (_id) => {
    await axios.delete(`http://localhost:3000/teams/${_id}`);

    const newTeams = [...teams].filter((team) => team._id !== _id);
    setTeams(newTeams);

    // Remove players associated with the deleted team
    const updatedPlayers = players.filter(
      (player) =>
        player.team_name !== teams.find((team) => team._id === _id).team_name
    );

    setPlayers(updatedPlayers);
  };

  return (
    <div className="App">
      <div>
        <h2>Players:</h2>
        <div>
          <label>Filter by Team Name:</label>
          <select
            value={filterByTeamName}
            onChange={(e) => setFilterByTeamName(e.target.value)}
          >
            <option value="">Show All</option>
            {uniqueTeamNames.map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Division:</label>
          <select
            value={filterByDivision}
            onChange={(e) => setFilterByDivision(e.target.value)}
          >
            <option value="">Show All</option>
            {uniqueDivisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Conference:</label>
          <select
            value={filterByConference}
            onChange={(e) => setFilterByConference(e.target.value)}
          >
            <option value="">Show All</option>
            {uniqueConferences.map((conference) => (
              <option key={conference} value={conference}>
                {conference}
              </option>
            ))}
          </select>
        </div>
        {filteredPlayers?.map((player) => {
          return (
            <div key={player._id}>
              <h3>
                {player.name}, Age {player.age}, {player.team_name},{" "}
                {player.position}, #{player.number}
              </h3>
              <button onClick={() => deletePlayer(player._id)}>
                Delete Player
              </button>
              <button onClick={() => toggleUpdate(player)}>
                Update Player
              </button>
            </div>
          );
        })}
      </div>

      {updateForm._id && (
        <div>
          <h2>Update Player</h2>
          <form onSubmit={updatePlayer}>
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.name}
              name="name"
            />
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.position}
              name="position"
            />
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.team_name}
              name="team_name"
            />
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.age}
              name="age"
            />
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.player_id}
              name="player_id"
            />
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.number}
              name="number"
            />
            <button type="submit">Update Player</button>
          </form>
        </div>
      )}

      {!updateForm._id && (
        <div>
          <h2>Create player</h2>
          <form onSubmit={createPlayer}>
            <input
              onChange={updateCreateFormFeild}
              value={createForm.name}
              name="name"
              placeholder="Enter Name"
            />
            <input
              onChange={updateCreateFormFeild}
              value={createForm.position}
              name="position"
              placeholder="Enter Position"
            />
            <input
              onChange={updateCreateFormFeild}
              value={createForm.team_name}
              name="team_name"
              placeholder="Enter Team Name"
            />
            <input
              onChange={updateCreateFormFeild}
              value={createForm.age}
              name="age"
              placeholder="Enter Player Age"
            />
            <input
              onChange={updateCreateFormFeild}
              value={createForm.player_id}
              name="player_id"
              placeholder="Enter Player ID"
            />
            <input
              onChange={updateCreateFormFeild}
              value={createForm.number}
              name="number"
              placeholder="Enter Player Number"
            />
            <button type="submit">Create Player</button>
          </form>
        </div>
      )}
      <div>
        <h2>Teams:</h2>
        {teams &&
          teams.map((team) => {
            return (
              <div key={team._id}>
                <h3>
                  {team.team_name}, {team.conference} {team.division},{" "}
                  {team.team_id}
                </h3>
                <button onClick={() => deleteTeam(team._id)}>
                  Delete Team
                </button>
                <button onClick={() => toggleUpdateTeam(team)}>
                  Update Team
                </button>
              </div>
            );
          })}
      </div>
      {updateTeamForm._id && (
        <div>
          <h2>Update Team</h2>
          <form onSubmit={updateTeam}>
            <input
              onChange={handleUpdateTeamFieldChange}
              value={updateTeamForm.team_name}
              name="team_name"
            />
            <input
              onChange={handleUpdateTeamFieldChange}
              value={updateTeamForm.team_id}
              name="team_id"
            />
            <input
              onChange={handleUpdateTeamFieldChange}
              value={updateTeamForm.conference}
              name="conference"
            />
            <input
              onChange={handleUpdateTeamFieldChange}
              value={updateTeamForm.division}
              name="division"
            />
            <button type="submit">Update Team</button>
          </form>
        </div>
      )}
      {showCreateTeamForm && (
        <div>
          <h2>Create Team</h2>
          <form onSubmit={createTeam}>
            <input
              value={createTeamForm.team_name}
              name="team_name"
              placeholder="Enter Team Name"
              readOnly
            />
            <input
              value={createTeamForm.team_id}
              name="team_id"
              placeholder="Enter Team ID"
              onChange={(e) =>
                setCreateTeamForm({
                  ...createTeamForm,
                  team_id: e.target.value,
                })
              }
            />
            <input
              value={createTeamForm.conference}
              name="conference"
              placeholder="Enter Conference"
              onChange={(e) =>
                setCreateTeamForm({
                  ...createTeamForm,
                  conference: e.target.value,
                })
              }
            />
            <input
              value={createTeamForm.division}
              name="division"
              placeholder="Enter Division"
              onChange={(e) =>
                setCreateTeamForm({
                  ...createTeamForm,
                  division: e.target.value,
                })
              }
            />
            <button type="submit">Create Team</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
