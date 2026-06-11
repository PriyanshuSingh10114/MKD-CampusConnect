const { Admission, Student } = require('../../models');

const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find().populate('student');
    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    next(error);
  }
};

const getAdmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id).populate('student');
    if (!admission) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    next(error);
  }
};

const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Find the admission and update its session/course if needed, or update the student status
    const admission = await Admission.findById(id).populate('student');
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });
    
    if (admission.student) {
      await Student.findByIdAndUpdate(admission.student._id, { status });
    }
    
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdmissions, getAdmissionById, updateAdmissionStatus };
