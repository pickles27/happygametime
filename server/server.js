const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('../database/db.js');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(1337);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

//--------------- socket.io ------------------------------------------------------------- 

io.on('connection', (socket) => {
  console.log('connected, yayyyy. client: ', client);
  socket.broadcast.emit('so and so connected');
  io.emit('this', { will: 'be seen by everyone' });

  socket.on('disconnect', () => {
    io.emit('so and so disconnected');
  })
});

//--------------- auth ------------------------------------------------------------------

app.post('/createaccount', (req, res) => {
  db.createUserAccount(req.body.email, req.body.username, req.body.password, req.body.password2).then(userInfo => {
    res.status(200).send(userInfo.rows[0]);
  }).catch(err => {
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
  db.getUserByUsername(req.body.username).then((userInDb) => {
    if (userInDb.rows.length === 0) {
      throw new Error("That username does not exist.");
    }
    return bcrypt.compare(req.body.password, userInDb.rows[0].password).then((isCorrectPassword) => {
      return Promise.resolve([userInDb, isCorrectPassword]);
    });
  }).then(([userInDb, isCorrectPassword]) => {
    if (isCorrectPassword) {
      var secretKey = Buffer.from(process.env.JWT_SECRET_KEY, "base64");
      jwt.sign(
        { 
          username: userInDb.rows[0].username,
          iat: Date.now() 
        },
        secretKey,
        (error, token) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.status(200).send({ 
              token: token,
              username: userInDb.rows[0].username,
              id: userInDb.rows[0].id,
              email: userInDb.rows[0].email,
              created: userInDb.rows[0].created
            }) ;
          }
        }
      );
    } else {
      throw new Error("Incorrect password.");
    }
  }).catch(error => {
    res.status(400).send({ message: error.message });
  });
});

app.get('/opengames', (req, res) => {
  db.getOpenGames().then(results => {
    res.status(200).send(results.rows);
  }).catch(error => {
    console.log('error from getOpenGames: ', error);
    res.status(400).send(error);
  });
});


//========================= authentication middleware =================================================
app.all('*', (req, res, next) => {
  var secretKey = Buffer.from(process.env.JWT_SECRET_KEY, "base64");
  var token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      res.status(401).send(error);
    } else {
      next();
    }
  });
});

app.get('/userinfo', (req, res) => {
  var userId = req.headers.userid;
  db.getUserById(userId)
  .then(results => {
    var userInfo = results.rows[0];
    res.status(200).send(userInfo);
  })
  .catch(error => {
    res.status(500).send(error);
  });
});

app.get('/usersgames', (req, res) => {
  db.getUserGames(req.query.userId).then(results => {
    res.status(200).send(results.rows);
  }).catch(error => {
    console.log('error from getUserGames: ', error);
    res.status(400).send(error);
  });
});

app.post('/newopengame', (req, res) => {
  var gameInfo = req.body;
  if (gameInfo.gameType !== 'tictactoe') {
    res.status(400).send({ message: 'Unsupported game type.'});
  }
  db.createOpenGame(gameInfo.creatorId, gameInfo.creatorUsername, gameInfo.gameType).then(results => {
    res.status(200).send(results.rows[0]);
  }).catch(error => {
    console.log('error from createopengame: ', error);
    res.status(400).send(error);
  });
});

app.post('/joingame', (req, res) => {
  console.log('req.body in /joingame: ', req.body);
    //fetch opengameinfo using gameid
    //use results of this to create new game and send back results from this function
    db.startOpenGame(req.body.gameId, req.body.player2)
    .then(results => {
      //returning id, game
      console.log('results.rows from startOpenGame in server.js: ', results.rows);
      res.status(200).send(results.rows[0]);
    })
    .catch(error => {
      console.log('error inside server for joingame request: ', error);
      res.status(400).send(error);
    });
});

//new game
app.post('/game', (req, res) => {
  db.newGame(req.body.player1, req.body.player2, req.body.type).then(results => {
      res.status(200).send(results.rows[0]);
  }).catch(error => {
      res.status(500).send(error);
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
      var validTurn = false;
      if (xTurn && req.body.userId === gameInfo.player1) {
        validTurn = true;
      }
      if (!xTurn && req.body.userId === gameInfo.player2) {
        validTurn = true;
      }
      if (boardCopy[req.body.location] !== null || !validTurn ) {
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


//======================== invitations ====================================================

app.post('/invitations', (req, res) => {
  res.send('hiiiii');
  
})

app.post('/invitebyusername', (req, res) => {
  //creatorId, recipientId, recipientEmail, gameType, customMessage
  //if user entered username only but there is no user matching, return error asking for email and say they don't have account yet
  //if user entered username and recipient does have an account, get their email and fill it in here
  db.getUserByUsername(req.body.recipientUsername).then((userInfo) => {
    db.sendInvitation(req.body.creatorId, userInfo.rows[0].id, userInfo.rows[0].email, req.body.gameType, req.body.customMessage).then((inviteId) => {
      res.status(200).send(inviteId.rows[0]);
    }).catch((error) => {
      res.status(500).send('error in app.post for invitebyusername: ', error);
    });
  });  //CHECK SPACING ON THESE!!! SEEMS WEIRD
});

app.post('/invitebyemail', (req, res) => {
  //get recipient username, need to query database to see if they exist, and check for their id.
  db.getUserByEmail(req.body.recipientEmail).then((userInfo) => {
    db.sendInvitation(req.body.creatorId, userInfo.rows[0].id, userInfo.rows[0].email, req.body.gameType, req.body.customMessage).then((inviteId) => {
      res.status(200).send(inviteId.rows[0]);
    }).catch((error) => {
      res.status(500).send('error in app.post for invitebyemail: ', error);
    });
  });
  //if user doesn't have an account yet, response with message: 'There isn't an account associated with this email yet. Send invitiation?
});

// const PORT = 1337;
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}........o.o`);
// });