const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
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
    res.status(400).send(translateDbError(err));
  });
});

function translateDbError(dbError) {
  if (dbError.constraint === 'username_unique') {
    return { message: 'That username has already been taken.' };
  }
  if (dbError.constraint === 'email_unique') {
    return { message: 'That email already has an account associated with it.' };
  }
  if (dbError instanceof Error) {
    return { message: dbError.message };
  }
}

app.post('/login', (req, res) => {
  console.log('req.body: ', req.body);
  db.getUserByUsername(req.body.username).then((userInDb) => {
    console.log('userInDb: ', userInDb);
    if (userInDb.rows.length === 0) {
      throw new Error("That username does not exist!");
    }
    //make sure password matches using bcrypt
    bcrypt.compare(req.body.password, userInDb.rows[0].password).then((isCorrectPassword) => {
      //if true then log in, generate and send back token
      if (isCorrectPassword) {
        //send back token
        var secretKey = Buffer.from(process.env.JWT_SECRET_KEY, "base64");
        jwt.sign({ username: req.body.username, iat: Date.now() }, secretKey, (error, token) => {
          if (error) {
            res.status(500).send(error);
          } else {
            console.log('token created in jwt.sign: ', token);
            res.status(200).send(
              { token: token,
                id: userInDb.rows[0].id,
                username: userInDb.rows[0].username,
                email: userInDb.rows[0].email,
                created: userInDb.rows[0].created
             });
          }
        });
      } else {
      //if false then return error
        throw new Error("Incorrect password. Try again!");
        //res.status(400).send({ message: 'Incorrect password. Try again!' });
      }
    })
  }).catch(error => {
    res.status(400).send({ message: error.message });
  });

});

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}........o.o`);
});