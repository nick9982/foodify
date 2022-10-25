const express = require('express');
const router = express.Router();

const {handleLoginAttempt} = require('../controllers/loginController');


router.post('/', handleLoginAttempt);

module.exports = router;