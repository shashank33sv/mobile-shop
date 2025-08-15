const express = require('express');
const router = express.Router();
const investmentsController = require('../controllers/investmentsController');

// GET all investments
router.get('/', investmentsController.getAll);

// POST create investment
router.post('/', investmentsController.create);

// PUT update investment by ID
router.put('/:id', investmentsController.update);

// DELETE investment by ID
router.delete('/:id', investmentsController.delete);

module.exports = router;
