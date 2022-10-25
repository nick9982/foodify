const express = require('express');
const router = express.Router();
const {handleCreateAccount} = require('../controllers/create_accController');


router.post('/', handleCreateAccount);

module.exports = router;