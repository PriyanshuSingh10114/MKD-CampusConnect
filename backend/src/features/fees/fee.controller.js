const { FeeStructure, Payment, Student, Admission } = require('../../models');

// ==========================================
// MODULE 2: FEE STRUCTURE
// ==========================================

const getFeeStructures = async (req, res, next) => {
  try {
    const feeStructures = await FeeStructure.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feeStructures });
  } catch (error) {
    next(error);
  }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const data = req.body;
    
    const existing = await FeeStructure.findOne({ course: data.course, academicYear: data.academicYear });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Fee structure for this course and year already exists.' });
    }

    const totalFee = 
      (Number(data.admissionFee) || 0) + 
      (Number(data.tuitionFee) || 0) + 
      (Number(data.examFee) || 0) + 
      (Number(data.libraryFee) || 0) + 
      (Number(data.developmentFee) || 0) +
      (Number(data.workshopFee) || 0) +
      (Number(data.labFee) || 0) +
      (Number(data.otherFee) || 0);
    
    const structure = new FeeStructure({ ...data, totalFee });
    await structure.save();

    res.status(201).json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const totalFee = 
      (Number(data.admissionFee) || 0) + 
      (Number(data.tuitionFee) || 0) + 
      (Number(data.examFee) || 0) + 
      (Number(data.libraryFee) || 0) + 
      (Number(data.developmentFee) || 0) +
      (Number(data.workshopFee) || 0) +
      (Number(data.labFee) || 0) +
      (Number(data.otherFee) || 0);

    const structure = await FeeStructure.findByIdAndUpdate(
      id, 
      { ...data, totalFee },
      { new: true, runValidators: true }
    );

    if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });

    res.status(200).json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FeeStructure.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Fee structure not found' });
    res.status(200).json({ success: true, message: 'Fee structure deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MODULE 3: FEE COLLECTION
// ==========================================

const getStudentFeeDetails = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    // Find by Admission Number or Object ID
    const isObjectId = studentId.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: studentId } : { admissionNumber: studentId };

    const student = await Student.findOne(query).lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const admissions = await Admission.find({ student: student._id }).lean();
    const activeAdmission = admissions[0];
    
    let totalFee = 0;
    if (activeAdmission) {
      const feeStructure = await FeeStructure.findOne({ course: activeAdmission.course });
      if (feeStructure) totalFee = feeStructure.totalFee;
    }

    const payments = await Payment.find({ student: student._id }).lean();
    const paidFee = payments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
    const pendingFee = totalFee > 0 ? (totalFee - paidFee) : 0;

    res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          admissionNumber: student.admissionNumber,
          studentName: student.personalDetails?.studentName,
          mobile: student.personalDetails?.mobile,
          course: activeAdmission?.course
        },
        feeSummary: {
          totalFee,
          paidFee,
          pendingFee
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const collectFee = async (req, res, next) => {
  try {
    const { studentId, amountPaid, paymentMode, transactionId, remarks, totalFee } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const previousPayments = await Payment.find({ student: studentId });
    const totalPaidSoFar = previousPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);

    const newTotalPaid = totalPaidSoFar + Number(amountPaid);
    const newDue = totalFee - newTotalPaid;

    const paymentCount = await Payment.countDocuments();
    const nextNum = (paymentCount + 1).toString().padStart(5, '0');
    const receiptNumber = `RCP-${new Date().getFullYear()}-${nextNum}`;

    const payment = new Payment({
      student: studentId,
      admissionNumber: student.admissionNumber,
      receiptNumber,
      paymentDate: new Date(),
      paymentMode,
      transactionId,
      amountPaid,
      totalFee,
      dueAmount: newDue,
      installmentNumber: previousPayments.length + 1,
      remarks,
      collectedBy: req.user ? req.user.id : null
    });

    await payment.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const getReceipts = async (req, res, next) => {
  try {
    const receipts = await Payment.find().populate('student', 'personalDetails.studentName admissionNumber').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    next(error);
  }
};

const getReceiptById = async (req, res, next) => {
  try {
    const { receiptId } = req.params;
    const receipt = await Payment.findById(receiptId).populate('student');
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    next(error);
  }
};

const getDefaulters = async (req, res, next) => {
  try {
    const defaulters = await Payment.find({ dueAmount: { $gt: 0 } }).populate('student');
    res.status(200).json({ success: true, data: defaulters });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure,
  getStudentFeeDetails, collectFee, getReceipts, getReceiptById,
  getDefaulters 
};
