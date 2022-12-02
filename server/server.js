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

app.use('/view_menu', require('./routes/viewMenu'));

app.use('/order', require('./routes/order'));

app.use('/verify_session', require('./routes/session'));

app.use('/remove_order', require('./routes/removeOrder'));

app.use('/customer_register', require('./routes/customer_register'));


app.listen(PORT, () => {
    console.log('I\'m listening on port http://localhost:' + PORT);
});