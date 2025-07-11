const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLogs, syncLogs, clearLogs } = require('../controllers/logController');

router.use(auth);
router.get('/', getLogs);
router.post('/sync', syncLogs);
router.delete('/', clearLogs);

module.exports = router; 