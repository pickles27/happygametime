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
app.post('/game/:gameId/moves', (req, res) => {
  db.getGameInfo(req.params.gameId, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      var gameInfo = results.rows[0].game;
      var boardCopy = gameInfo.state.board.slice();
      if (boardCopy[req.body.location] !== null) {
        //do nothing since spot is taken, send back same board and xTurn with winner still null
        var responseForInvalidMove = {
          "game": {
            "winner": gameInfo.winner,
            "state": {
              "board": gameInfo.state.board,
              "xTurn": gameInfo.state.xTurn
            }
          }
        };
        res.status(200).send(responseForInvalidMove);
      } else {
        db.move(req.params.gameId, gameInfo, req.body.location, (err, moveResults) => {
          if (err) {
            console.log('getting error in db.move invocation', err);
            res.status(500).send(err);
          } else {
            console.log('move results: ', moveResults.rows[0].game.state);
            res.status(200).send(moveResults.rows[0]);
          }
        });
      }
    }
  });

});

//--------------- auth ------------------------------------------------------------------

app.post('/createaccount', (req, res) => {
  db.createUserAccount(req.body.email, req.body.username, req.body.password, req.body.password2).then(userInfo => {
    res.status(200).send(userInfo.rows[0]);
  }).catch(err => {
    console.log('err in create account app.post: ', err);
    res.status(500).send(err);
  });
});

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}........o.o`);
});