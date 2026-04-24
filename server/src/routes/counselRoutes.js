const express = require('express');
const router = express.Router();
const { getCounselRequests, createCounselRequest, updateCounselStatus } = require('../controllers/miscControllers');
const auth = require('../middleware/auth');

router.get('/', auth, getCounselRequests);
router.post('/', createCounselRequest);
router.put('/:id/status', auth, updateCounselStatus);

module.exports = router;
