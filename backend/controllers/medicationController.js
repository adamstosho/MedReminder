  const Medication = require('../models/Medication');

  exports.getMedications = async (req, res, next) => {
    try {
      const meds = await Medication.find({ userId: req.user.id });
      res.json(meds);
    } catch (err) {
      next(err);
    }
  };

  exports.createMedication = async (req, res, next) => {
    try {
      const { name, dosage, times, remindersEnabled } = req.body;
      const med = new Medication({
        userId: req.user.id,
        name,
        dosage,
        times,
        remindersEnabled,
      });
      await med.save();
      res.json(med);
    } catch (err) {
      next(err);
    }
  };

  exports.updateMedication = async (req, res, next) => {
    try {
      const { name, dosage, times, remindersEnabled } = req.body;
      const { id } = req.params;
      const med = await Medication.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { name, dosage, times, remindersEnabled },
        { new: true }
      );
      if (!med) {
        return res.status(404).json({ message: 'Medication not found' });
      }
      res.json(med);
    } catch (err) {
      next(err);
    }
  };

  exports.deleteMedication = async (req, res, next) => {
    try {
      await Medication.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.json({ message: 'Medication deleted' });
    } catch (err) {
      next(err);
    }
  }; 