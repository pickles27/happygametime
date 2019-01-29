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

function newGame(player1, player2, type, callback) {
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

  let beginTimestamp = Date.now();

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
  client.query(query, values, callback);
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

function userInfoIsValid(email, username, password, password2) {
  let validEmail = email.trim() !== '' ? true : false;
  let validUsername = username.trim() !== '' ? true : false;
  let validPassword = (password.length > 5 && password.length < 73 && password === password2) ? true : false;
  return validEmail && validUsername && validPassword;
}

function createUserAccount(email, username, password, password2, callback) {
  //verify username, email and password
  if (userInfoIsValid(email, username, password, password2)) {
    //use bcrypt to hash password
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.log(err);
      } else {
        let query = 'INSERT INTO users (username, password, email, created) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id, username, email, created';
        let values = [username, hash, email];
        client.query(query, values, callback);
      }
    });
  } else {
    //return error for invalid email, username or password
    console.log('Invalid email, username or password.');
    //let errorMessage = 'Please make sure your password is between 6 and 72 characters, and that you have entered your email and username!';
  }


}

module.exports = {
  newGame,
  getGameInfo,
  move,
  createUserAccount
};