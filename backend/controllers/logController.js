const Log = require('../models/Log');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).populate('medicationId');
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

exports.syncLogs = async (req, res, next) => {
  try {
    const logs = req.body.logs;
    if (!Array.isArray(logs)) {
      return res.status(400).json({ message: 'Logs should be an array' });
    }
    const createdLogs = await Log.insertMany(
      logs.map(log => ({ ...log, userId: req.user.id }))
    );
    res.status(201).json(createdLogs);
  } catch (err) {
    next(err);
  }
};

exports.clearLogs = async (req, res, next) => {
  try {
    await Log.deleteMany({ userId: req.user.id });
    res.json({ message: 'All logs cleared successfully.' });
  } catch (err) {
    next(err);
  }
}; 