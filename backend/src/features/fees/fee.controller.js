const { FeeStructure, Payment, Student, Admission } = require('../../models');

const asyncHandler = require('../../shared/middlewares/async.middleware');

// ==========================================
// MODULE 2: FEE STRUCTURE
// ==========================================

const getFeeStructures = asyncHandler(async (req, res) => {
  const feeStructures = await FeeStructure.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: feeStructures });
});

const createFeeStructure = asyncHandler(async (req, res) => {
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
});

const updateFeeStructure = asyncHandler(async (req, res) => {
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
});

const deleteFeeStructure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await FeeStructure.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Fee structure not found' });
  res.status(200).json({ success: true, message: 'Fee structure deleted' });
});

// ==========================================
// MODULE 3: FEE COLLECTION
// ==========================================

const getStudentFeeDetails = asyncHandler(async (req, res) => {
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
    const feeStructure = await FeeStructure.findOne({ course: activeAdmission.course, academicYear: activeAdmission.session });
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
        course: activeAdmission?.course,
        session: activeAdmission?.session
      },
      feeSummary: {
        totalFee,
        paidFee,
        pendingFee
      }
    }
  });
});

const collectFee = asyncHandler(async (req, res) => {
  const { studentId, amountPaid, paymentMode, transactionId, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const admissions = await Admission.find({ student: student._id }).lean();
  const activeAdmission = admissions[0];
  
  let totalFee = 0;
  if (activeAdmission) {
    const feeStructure = await FeeStructure.findOne({ course: activeAdmission.course, academicYear: activeAdmission.session });
    if (feeStructure) totalFee = feeStructure.totalFee;
  }

  if (totalFee === 0) {
    return res.status(400).json({ success: false, message: 'Fee structure not defined for this student\'s course/session' });
  }

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
});

const getReceipts = asyncHandler(async (req, res) => {
  const receipts = await Payment.find().populate('student', 'personalDetails.studentName admissionNumber').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: receipts });
});

const getReceiptById = asyncHandler(async (req, res) => {
  const { receiptId } = req.params;
  const receipt = await Payment.findById(receiptId).populate('student');
  if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
  res.status(200).json({ success: true, data: receipt });
});

const getDefaulters = asyncHandler(async (req, res) => {
    const { search, course, session, sort } = req.query;
    
    let matchStage = { status: 'Active' };
    if (search) {
      matchStage.$or = [
        { admissionNumber: { $regex: search, $options: 'i' } },
        { 'personalDetails.studentName': { $regex: search, $options: 'i' } },
        { 'personalDetails.mobile': { $regex: search, $options: 'i' } }
      ];
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'admissions',
          localField: '_id',
          foreignField: 'student',
          as: 'admissions'
        }
      },
      { $unwind: { path: '$admissions', preserveNullAndEmptyArrays: true } },
      ...(course ? [{ $match: { 'admissions.course': course } }] : []),
      ...(session ? [{ $match: { 'admissions.session': session } }] : []),
      {
        $lookup: {
          from: 'feestructures',
          let: { course: '$admissions.course', session: '$admissions.session' },
          pipeline: [
            { $match: { $expr: { $and: [ { $eq: ['$course', '$$course'] }, { $eq: ['$academicYear', '$$session'] } ] } } }
          ],
          as: 'feeStructure'
        }
      },
      { $unwind: { path: '$feeStructure', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'student',
          as: 'payments'
        }
      },
      {
        $addFields: {
          totalFee: { $ifNull: ['$feeStructure.totalFee', 0] },
          paidFee: { $sum: '$payments.amountPaid' },
          lastPaymentDate: { $max: '$payments.paymentDate' }
        }
      },
      {
        $addFields: {
          pendingFee: { $subtract: ['$totalFee', '$paidFee'] }
        }
      },
      { $match: { pendingFee: { $gt: 0 } } },
      { $sort: sort === 'lowest' ? { pendingFee: 1 } : sort === 'recent' ? { 'admissions.createdAt': -1 } : { pendingFee: -1 } },
      {
        $project: {
          studentId: '$_id',
          admissionNumber: 1,
          studentName: '$personalDetails.studentName',
          course: '$admissions.course',
          session: '$admissions.session',
          mobile: '$personalDetails.mobile',
          totalFee: 1,
          paidFee: 1,
          pendingFee: 1,
          lastPaymentDate: 1,
          status: 1
        }
      }
    ];

  const defaulters = await Student.aggregate(pipeline);

  res.status(200).json({ success: true, data: defaulters });
});

module.exports = { 
  getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure,
  getStudentFeeDetails, collectFee, getReceipts, getReceiptById,
  getDefaulters 
};
