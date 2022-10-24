const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');



app.use(cors());

app.use('/login', require('./routes/login'));

app.listen(PORT, () => {
    console.log('Hello World! \nI\'m listening on port ' + PORT +'!');
});