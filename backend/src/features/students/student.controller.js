const { Student, Admission, Payment, FeeStructure } = require('../../models');

const asyncHandler = require('../../shared/middlewares/async.middleware');

const getStudents = asyncHandler(async (req, res) => {
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
});

const getStudentById = asyncHandler(async (req, res) => {
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
      // Try to find fee structure for this course and session
      const feeStructure = await FeeStructure.findOne({ course: activeAdmission.course, academicYear: activeAdmission.session });
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
});

const createStudent = asyncHandler(async (req, res) => {
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
});

const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { personalDetails, addressDetails, academicDetails } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (personalDetails) student.personalDetails = { ...student.personalDetails, ...personalDetails };
    if (addressDetails) student.addressDetails = { ...student.addressDetails, ...addressDetails };
    if (academicDetails) student.academicDetails = { ...student.academicDetails, ...academicDetails };

    await student.save();

    res.status(200).json({ success: true, data: student, message: 'Student profile updated successfully' });
});

module.exports = { getStudents, getStudentById, createStudent, updateStudent };
