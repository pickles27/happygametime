const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname,'../public')));

// app.get('/', (req, res) => {
//   res.send('hiiiiiii from express!!');
// });

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}........o.o`);
})