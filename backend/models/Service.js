const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// GET all services
router.get('/', servicesController.getAll);

// GET service by ID (valid parameter name)
router.get('/:id', servicesController.getById);

// POST create service
router.post('/', servicesController.create);

// PUT update service by ID
router.put('/:id', servicesController.update);

// DELETE service by ID
router.delete('/:id', servicesController.delete);

module.exports = router;
