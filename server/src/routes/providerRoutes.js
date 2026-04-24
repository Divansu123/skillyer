const express = require('express');
const router = express.Router();
const { getProviders, createProvider, deleteProvider, updateProvider } = require('../controllers/miscControllers');
const auth = require('../middleware/auth');

router.get('/', getProviders);
router.post('/', auth, createProvider);
router.put('/:id', auth, updateProvider);
router.delete('/:id', auth, deleteProvider);

module.exports = router;
