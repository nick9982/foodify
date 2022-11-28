const express = require('express');
const router = express.Router();
const {handleCreateAccount} = require('../controllers/customer_createAcc');


router.post('/', handleCreateAccount);

module.exports = router;