const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getApplications, createApplication, updateApplicationStatus, deleteApplication } = require('../controllers/miscControllers');
const auth = require('../middleware/auth');

// Multer config for CV/resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, DOC, DOCX files allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

router.get('/', auth, getApplications);
router.post('/', upload.single('cv'), createApplication);
router.put('/:id/status', auth, updateApplicationStatus);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
