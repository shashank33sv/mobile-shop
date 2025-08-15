const express = require('express');
const router = express.Router();
const billsController = require('../controllers/billsController');

// GET all bills
router.get('/', billsController.getAll);

// POST create a new bill
router.post('/', billsController.create);

module.exports = router;
