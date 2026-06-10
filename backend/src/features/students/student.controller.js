const { Student, Admission } = require('../../models');

const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const admissions = await Admission.find({ student: id });

    res.status(200).json({ success: true, data: { ...student.toObject(), admissions } });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const data = req.body;
    
    // Auto-generate admission number if not provided
    if (!data.admissionNumber) {
      const count = await Student.countDocuments();
      const nextNum = (count + 1).toString().padStart(4, '0');
      data.admissionNumber = `MKD-${new Date().getFullYear()}-${nextNum}`;
    }

    const student = new Student(data);
    await student.save();

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudents, getStudentById, createStudent };
