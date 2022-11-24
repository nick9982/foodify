const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

const logger = require('morgan');

app.use(logger('dev'));

app.use(express.json());

app.use(cors());

app.use('/create_account', require('./routes/create_acc'));

app.use('/login', require('./routes/login'));

app.listen(PORT, () => {
    console.log('Hello World! \nI\'m listening on port http://localhost:' + PORT);
});