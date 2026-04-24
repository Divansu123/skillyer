// testimonialRoutes.js
const express = require('express');
const r1 = express.Router();
const { getTestimonials } = require('../controllers/miscControllers');
r1.get('/', getTestimonials);
module.exports = r1;
