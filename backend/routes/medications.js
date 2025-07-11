const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

router.use(auth);
router.get('/', getMedications);
router.post('/', createMedication);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);

module.exports = router; 