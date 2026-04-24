const express = require('express');
const router = express.Router();
const { getRoiData } = require('../controllers/miscControllers');
router.get('/', getRoiData);
module.exports = router;
