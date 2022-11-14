const express = require('express');
const router = express.Router();
const {handleSession} = require('../controllers/sessionController');


router.post('/', handleSession);

module.exports = router;