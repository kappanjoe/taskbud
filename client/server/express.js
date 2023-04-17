const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/', express.static(__dirname + '/../build'));

app.listen(PORT, () => {
  console.log(`Now using port ${PORT}. (...What, like it had anything better to do?)`);
});