require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

client.connect();

/*
table: gameplay
columns: id and games

games: 
{
  "playerX": *player x id number*, NOT NULL
  "playerO": *player o id number*, NOT NULL
  "type": "tictactoe", (or "chess", "checkers", etc) NOT NULL
  "winner": *winning player ID*,
  "begin": *timestamp for begin of game*, NOT NULL
  "end": *timestamp for end of game*,
  "state": {
    "board": [null, null, null, null, null, null, null, null, null],
    "xTurn": true,
    "winner": null
  }
}

*/

function newGame(player1, player2, type, callback) {
  //adds new row to gameplay table
  let gameState = {};
  if (type === 'tictactoe') {
    gameState = {
      "board": [null, null, null, null, null, null, null, null, null],
      "xTurn": true,
      "winner": null
    };
  } else if (type === 'checkers') {
    gameState = {
      //game state object for checkers
    };
  } else {
    //etc for all game types
  }

  let beginTimestamp = Date.now();

  let newGameObject = {
    "player1": player1,
    "player2": player2,
    "type": type, //type of game
    "winner": null, //should this be in the state or here?
    "begin": beginTimestamp,
    "end": null, //when game ends, record this
    "state": gameState
  };
  let query = `INSERT INTO gameplay (games) VALUES ${JSON.stringify(newGameObject)}`;
  client.query(query, callback);
}

//--------------------------------------------------------------------------------
//game functions for tictactoe
function getGameState(gameId, callback) {
  let stateQuery = `SELECT games -> 'state' FROM gameplay WHERE id = ${gameId}`;
  client.query(stateQuery, callback);
}

module.exports = {
  newGame,
  getGameState
};