const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT
});

await client.connect();
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

function newGame(playerX, playerO, type, beginTimestamp, callback) {
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

  let newGameObject = {
    "playerX": playerX,
    "playerO": playerO,
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
function getGameState(beginTime, callback) {
  let stateQuery = `SELECT games -> 'state' FROM gameplay WHERE games ->> begin = ${beginTime}`;
  client.query(stateQuery, callback);
}

module.exports = {
  newGame,
  getGameState
};