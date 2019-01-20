const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/db.js');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

//new game
app.post('/game', (req, res) => {
  db.newGame(req.body.player1, req.body.player2, req.body.type, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(results.rows[0]);
    }
  });
});

//post move
app.post('/games/:gameId/moves', (req, res) => {
  //get game state
  //check if move is valid (spot at index passed in should be empty), do nothing if invalid move
  //update board array
  db.getGameInfo(req.params.gameId, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      //get board from state
      var gameInfo = results.rows[0].game;
      var boardCopy = gameInfo.state.board.slice();
      if (boardCopy[req.body.location] !== null) {
        //do nothing since spot is taken, send back same board and xTurn with winner still null
        var responseForInvalidMove = {
          "board": gameInfo.state.board,
          "xTurn": gameInfo.state.xTurn
        };
        res.status(200).send(responseForInvalidMove);
      } else {
        //invoke move function
        db.move(req.params.gameId, gameInfo, req.body.location, (error, moveResults) => {
          if (error) {
            console.log('getting error in db.move invocation');
            res.status(500).send(error);
          } else {
            //need to check for win
            console.log('move results: ', moveResults.rows[0]);
            res.status(200).send(moveResults.rows[0]);
          }
        });
      }
    }
  });
  
  //check for win with checkForWin function
  //if there is a win, invoke db.handleWin function

});

//check for win
// function checkForWin(boardArray) {
//   if (boardArray[0] && boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2] ||
//       boardArray[3] && boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5] ||
//       boardArray[6] && boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8] ||
//       boardArray[0] && boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6] ||
//       boardArray[1] && boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7] ||
//       boardArray[2] && boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8] ||
//       boardArray[0] && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8] ||
//       boardArray[2] && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
//     return true;
//   }
//   return false;
// }

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}........o.o`);
});