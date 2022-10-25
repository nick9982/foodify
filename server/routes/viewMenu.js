const express = require('express');
const router = express.Router();

const {handleGetMenu} = require('../controllers/menuController');


router.get('/', handleGetMenu);

module.exports = router;