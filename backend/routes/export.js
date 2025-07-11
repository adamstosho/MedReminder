const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportData } = require('../controllers/exportController');

router.use(auth);
router.get('/', exportData);

module.exports = router; 