const { Settings, User, Student, Admission, FeeStructure, Payment } = require('../../models');
const asyncHandler = require('../../shared/middlewares/async.middleware');

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.status(200).json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { institution, receipt, admission, system } = req.body;
  
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  if (institution) settings.institution = { ...settings.institution, ...institution };
  if (receipt) settings.receipt = { ...settings.receipt, ...receipt };
  if (admission) settings.admission = { ...settings.admission, ...admission };
  if (system) settings.system = { ...settings.system, ...system };

  await settings.save();
  
  res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
});

const getBackup = asyncHandler(async (req, res) => {
  const [users, students, admissions, feeStructures, payments, settings] = await Promise.all([
    User.find(),
    Student.find(),
    Admission.find(),
    FeeStructure.find(),
    Payment.find(),
    Settings.findOne()
  ]);

  const backupData = {
    metadata: { timestamp: new Date().toISOString(), version: '1.0' },
    data: { users, students, admissions, feeStructures, payments, settings }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="erp_backup_${new Date().getTime()}.json"`);
  res.status(200).send(JSON.stringify(backupData, null, 2));
});

module.exports = { getSettings, updateSettings, getBackup };
