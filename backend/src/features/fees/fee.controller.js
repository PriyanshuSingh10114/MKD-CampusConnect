const { FeeStructure, Payment, Student } = require('../../models');

const getFeeStructures = async (req, res, next) => {
  try {
    const feeStructures = await FeeStructure.find();
    res.status(200).json({ success: true, data: feeStructures });
  } catch (error) {
    next(error);
  }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const data = req.body;
    const totalFee = 
      (data.admissionFee || 0) + 
      (data.tuitionFee || 0) + 
      (data.examFee || 0) + 
      (data.libraryFee || 0) + 
      (data.developmentFee || 0);
    
    const structure = new FeeStructure({ ...data, totalFee });
    await structure.save();

    res.status(201).json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { amountPaid, paymentMode, remarks, totalFee } = req.body;

    const previousPayments = await Payment.find({ student: studentId });
    const totalPaidSoFar = previousPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);

    const newTotalPaid = totalPaidSoFar + Number(amountPaid);
    const newDue = totalFee - newTotalPaid;

    const payment = new Payment({
      student: studentId,
      receiptNumber: `REC-${Date.now()}`,
      paymentDate: new Date(),
      paymentMode,
      amountPaid,
      totalFee,
      dueAmount: newDue,
      installmentNumber: previousPayments.length + 1,
      remarks
    });

    await payment.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const getDefaulters = async (req, res, next) => {
  try {
    // Find all payments where due amount > 0, getting the latest per student
    // For simplicity, just finding those that have dueAmount > 0
    const defaulters = await Payment.find({ dueAmount: { $gt: 0 } }).populate('student');
    res.status(200).json({ success: true, data: defaulters });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFeeStructures, createFeeStructure, recordPayment, getDefaulters };
