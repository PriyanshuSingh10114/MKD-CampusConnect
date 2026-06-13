const { Settings } = require('../../models');
const asyncHandler = require('../../shared/middlewares/async.middleware');

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.status(200).json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { institution, receipt, admission } = req.body;
  
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  if (institution) settings.institution = { ...settings.institution, ...institution };
  if (receipt) settings.receipt = { ...settings.receipt, ...receipt };
  if (admission) settings.admission = { ...settings.admission, ...admission };

  await settings.save();
  
  res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
});

module.exports = { getSettings, updateSettings };
