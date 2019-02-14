require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

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
columns: id and game

game: 
{
  "player1": *player x id number*, NOT NULL
  "player2": *player o id number*, NOT NULL
  "type": "tictactoe", (or "chess", "checkers", etc) NOT NULL
  "winner": *winning player ID*,
  "begin": *timestamp for begin of game*, NOT NULL
  "end": *timestamp for end of game*,
  "state": {
    STATE IS UNIQUE FOR EACH TYPE OF GAME, THE REST IS NOT
    "board": [null, null, null, null, null, null, null, null, null],
    "xTurn": true,
  }
}

happygametime=# CREATE TABLE users (
ID serial NOT NULL PRIMARY KEY,
username VARCHAR(100) NOT NULL,
password VARCHAR(60),email VARCHAR(100));

*/

function newGame(player1, player2, type) {
  //adds new row to gameplay table
  let gameState = {};
  if (type === 'tictactoe') {
    gameState = {
      "board": [null, null, null, null, null, null, null, null, null],
      "xTurn": true
    };
  } else if (type === 'checkers') {
    gameState = {
      //game state object for checkers
    };
  } else {
    //etc for all game types
  }

  let beginTimestamp;
  if (player2 !== null) {
    beginTimestamp = Date.now();
  } else {
    beginTimestamp = null;
  }

  let newGameObject = {
    "player1": player1,
    "player2": player2,
    "type": type, //type of game
    "winner": null, //player id of winner
    "begin": beginTimestamp,
    "end": null, //when game ends, record this
    "state": gameState
  };
  let query = 'INSERT INTO gameplay (game) VALUES ($1) RETURNING id, game';
  let values = [JSON.stringify(newGameObject)];
  return client.query(query, values);
}

//--------------------------------------------------------------------------------
//game functions for tictactoe
function getGameInfo(gameId, callback) {
  let stateQuery = `SELECT game FROM gameplay WHERE id = ${gameId}`;
  client.query(stateQuery, callback);
}

function checkForWin(boardArray) {
  if (boardArray[0] && boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2] ||
      boardArray[3] && boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5] ||
      boardArray[6] && boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8] ||
      boardArray[0] && boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6] ||
      boardArray[1] && boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7] ||
      boardArray[2] && boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8] ||
      boardArray[0] && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8] ||
      boardArray[2] && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
    return true;
  }
  return false;
}

function move(gameId, gameInfo, index, callback) {
  var newBoard = gameInfo.state.board.slice();
  var xTurn = gameInfo.state.xTurn;
  newBoard[index] = xTurn ? 'X' : 'O';
  var updatedGame = {
    "player1": gameInfo.player1,
    "player2": gameInfo.player2,
    "type": 'tictactoe',
    "winner": null,
    "begin": gameInfo.begin,
    "end": null,
    "state": {
      "board": newBoard,
      "xTurn": xTurn,
    }
  };
  var winDetected = checkForWin(newBoard);
  if (winDetected) {
    updatedGame.end = Date.now();
    updatedGame.winner = xTurn ? gameInfo.player1 : gameInfo.player2;
  } else {
    updatedGame.state.xTurn = !gameInfo.state.xTurn;
  }
  var moveQuery = `UPDATE gameplay SET game = $1
                   WHERE id = $2
                   RETURNING game`;
  var values = [JSON.stringify(updatedGame), gameId];
  client.query(moveQuery, values, callback);
}

//================================= AUTH FUNCTIONS ==============================================

function validateUserInfo(email, username, password, password2) {
  if (email.trim() === "") {
    return Promise.reject(new Error("Invalid email."));
  }
  if (username.trim() === "") {
    return Promise.reject(new Error("Invalid username."));
  }
  if (password.length < 6 || password.length > 72) {
    return Promise.reject(new Error("Password must be between 6 and 72 characters."));
  }
  if (password !== password2) {
    return Promise.reject(new Error("Passwords must match."));
  }
  return Promise.resolve();
}

function createUserAccount(email, username, password, password2) {
  return validateUserInfo(email, username, password, password2).then(() => {
    return bcrypt.hash(password, 10);
  }).then((hash) => {
      let query = 'INSERT INTO users (username, password, email, created) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, username, email, created';
      let values = [username, hash, email];
      return client.query(query, values);
  });
}

function getUserByUsername(username) {
  let query = 'SELECT id, username, password, email, created FROM users WHERE username = $1';
  let values = [username];
  return client.query(query, values);
}

function getUserByEmail(email) {
  let query = 'SELECT id, username, password, email, created FROM users WHERE email = $1';
  let values = [email];
  return client.query(query, values);
}

function getUserById(id) {
  let query = 'SELECT id, username, password, email, created FROM users WHERE id = $1';
  let values = [id];
  return client.query(query, values);
}

//=========================== invitations ==================================================
/*
CREATE TABLE invitations (inviteId SERIAL NOT NULL PRIMARY KEY, creatorId int, 
recipientId int, recipientEmail varchar(100), gameType varchar(100), 
customMessage varchar(200), timestampSent timestamp, timestampOpened timestamp, 
resolved boolean, challengeAccepted boolean);
*/

function sendInvitation(creatorId, recipientId, recipientEmail, gameType, customMessage) {
  let timestampSent = Date.now();
  let resolved = false;
  let query = 'INSERT INTO invitations (creatorId, recipientId, recipientEmail, gameType, customMessage, timestampSent, resolved) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING inviteId';
  let values = [creatorId, recipientId, recipientEmail, gameType, customMessage, timestampSent, resolved];
  return client.query(query, values);
}

function createOpenGame(creatorId, creatorUsername, gameType) {
  let query = 'INSERT INTO opengames (creatorid, creatorusername, gametype, timestamp, accepted) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING id, creatorid, creatorusername, gametype, timestamp';
  let values = [creatorId, creatorUsername, gameType, false];
  return client.query(query, values);
}

function getOpenGames() {
  let query = 'SELECT id, creatorid, creatorusername, gametype, timestamp FROM opengames WHERE accepted = false';
  return client.query(query);
}

function acceptOpenGame(openGameId, player2Id) {
    let query = 'UPDATE opengames SET accepted = true WHERE id = $1 RETURNING creatorid, gametype';
    let values = [openGameId];
    return client.query(query, values);
}

function startOpenGame(openGameId, player2Id) {
  return acceptOpenGame(openGameId, player2Id)
  .then(gameInfo => {
    var player1Id = gameInfo.rows[0].creatorid;
    var gametype = gameInfo.rows[0].gametype;
    return newGame(player1Id, player2Id, gametype);
  })
}


//==========================================================================================

module.exports = {
  newGame,
  getGameInfo,
  move,
  createUserAccount,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  sendInvitation,
  createOpenGame,
  acceptOpenGame,
  getOpenGames,
  startOpenGame
};