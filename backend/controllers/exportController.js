const Medication = require('../models/Medication');
const Log = require('../models/Log');

exports.exportData = async (req, res, next) => {
  try {
    const medications = await Medication.find({ userId: req.user.id });
    const logs = await Log.find({ userId: req.user.id });
    res.json({ medications, logs });
  } catch (err) {
    next(err);
  }
}; 