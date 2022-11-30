const express = require('express');
const router = express.Router();

const {removeOrder} = require('../controllers/deleteOrder');


router.post('/', removeOrder);

module.exports = router;