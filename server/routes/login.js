const express = require('express');
const router = express.Router();

const {handleLoginAttempt} = require('../controllers/loginController');


router.get('/', handleLoginAttempt);

module.exports = router;