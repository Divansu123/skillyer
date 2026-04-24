const express = require('express');
const router = express.Router();
const { getEnrollments, createEnrollment, updateEnrollmentStatus, updateEnrollment, deleteEnrollment } = require('../controllers/miscControllers');
const auth = require('../middleware/auth');

router.get('/', auth, getEnrollments);
router.post('/', createEnrollment);
router.put('/:id/status', auth, updateEnrollmentStatus);
router.put('/:id', auth, updateEnrollment);
router.delete('/:id', auth, deleteEnrollment);

module.exports = router;
