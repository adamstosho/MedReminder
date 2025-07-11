const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  times: [{ type: String, required: true }],
  remindersEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('Medication', MedicationSchema); 