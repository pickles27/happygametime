const { Client } = require('pg');

const client = new Client({
  user: 'coding',
  host: 'localhost',
  database: 'happygametime',
  password: '',
  port: 5432
});

await client.connect();
/*
Postgres database = happygametime
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

//game functions
function newGame(playerX, playerO, type, beginTimestamp) {
  //add new row to gameplay table, with new id and game
  let newGameObject = {
    "playerX": playerX,
    "playerO": playerO,
    "type": type,
    "winner": null, //should this be in the state or here?
    "begin": beginTimestamp,
    "end": null,
    "state": {
      "board": [null, null, null, null, null, null, null, null, null],
      "xTurn": true,
      "winner": null //is this necessary anymore??
    }
  };
  let query = `INSERT INTO gameplay (games) VALUES ${newGameObject}`;
}

//module.exports