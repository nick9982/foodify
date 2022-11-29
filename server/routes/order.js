const express = require('express');
const router = express.Router();

const {handleGetAllOrders, handleTakeOrder} = require('../controllers/orderController');


router.get('/allOrders', handleGetAllOrders);
router.post('/takeOrder', handleTakeOrder);

module.exports = router;