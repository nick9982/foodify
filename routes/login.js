const express = require('express');
const router = express.Router();

const {handleGetMenu} = require('../controllers/menuController');


router.get('/', handleGetMenu);

const {handleLoginAttempt} = require('../controllers/loginController');


router.post('/', handleLoginAttempt);

module.exports = router;