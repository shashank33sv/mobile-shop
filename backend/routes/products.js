const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAll);

// POST create product
router.post('/', productsController.create);

// PUT update product by ID
router.put('/:id', productsController.update);

// DELETE product by ID
router.delete('/:id', productsController.delete);

module.exports = router;
