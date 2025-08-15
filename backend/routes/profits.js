const express = require('express');
const router = express.Router();
const profitController = require('../controllers/profitController');

// GET all profits
router.get('/', profitController.getProfit);

// POST create or update profit
router.post('/', profitController.createOrUpdateProfit);

// POST recalculate profits
router.post('/recalculate', profitController.calculateAndStoreProfits);

module.exports = router;
