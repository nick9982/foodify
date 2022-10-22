const express = require('express');
const router = express.Router();
const {handleLogin} = require('../controllers/loginController');


router.get('/', handleLogin);

module.exports = router;