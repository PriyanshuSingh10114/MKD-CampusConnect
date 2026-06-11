const { Student, Admission, Payment, FeeStructure } = require('../../models');

const getStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { admissionNumber: { $regex: search, $options: 'i' } },
          { 'personalDetails.studentName': { $regex: search, $options: 'i' } },
          { 'personalDetails.mobile': { $regex: search, $options: 'i' } }
        ]
      };
    }
    const students = await Student.find(query).limit(20);
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const admissions = await Admission.find({ student: id }).lean();
    student.admissions = admissions;
    
    // Calculate fee summary
    let feeSummary = { totalFee: 0, paidFee: 0, pendingFee: 0, installmentsPaid: 0 };
    
    if (admissions.length > 0) {
      const activeAdmission = admissions[0];
      // Try to find fee structure for this course
      const feeStructure = await FeeStructure.findOne({ course: activeAdmission.course });
      if (feeStructure) {
        feeSummary.totalFee = feeStructure.totalFee;
      }
    }
    
    const recentPayments = await Payment.find({ student: id }).sort({ paymentDate: -1 }).lean();
    
    feeSummary.paidFee = recentPayments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
    feeSummary.pendingFee = feeSummary.totalFee > 0 ? (feeSummary.totalFee - feeSummary.paidFee) : 0;
    feeSummary.installmentsPaid = recentPayments.length;

    res.status(200).json({ 
      success: true, 
      data: { 
        student, 
        feeSummary, 
        recentPayments 
      } 
    });
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
