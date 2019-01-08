const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/db.js');

const app = express();

app.use(express.static(path.join(__dirname,'../public')));

//handle new game
//send back new timestamp

//check for win
app.get('/tttwin', (req, res) => {
  let timestamp = req.params.time;
  db.getGameState(timestamp, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      let boardArray = results.board;
      if (boardArray[0] && boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2] ||
          boardArray[3] && boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5] ||
          boardArray[6] && boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8] ||
          boardArray[0] && boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6] ||
          boardArray[1] && boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7] ||
          boardArray[2] && boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8] ||
          boardArray[0] && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8] ||
          boardArray[2] && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) 
      {
        res.status(200).send({"result": true});
      } else {
        res.status(200).send({"result": false});
      }
    }
  });
});

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}........o.o`);
});