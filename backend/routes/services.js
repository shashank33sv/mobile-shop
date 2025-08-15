const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController'); // make sure controller file matches

router.get('/', servicesController.getAll);
router.get('/:id', servicesController.getById);
router.post('/', servicesController.create);
router.put('/:id', servicesController.update);
router.delete('/:id', servicesController.delete);
module.exports = router;
