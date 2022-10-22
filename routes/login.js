const express = require('express');
const router = express.Router();
const {handleMenu} = require('../controllers/menuController');


router.get('/', handleMenu);

module.exports = router;