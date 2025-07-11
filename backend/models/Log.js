const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  action: { type: String, enum: ['taken', 'missed', 'snoozed'], required: true },
});

module.exports = mongoose.model('Log', LogSchema); 