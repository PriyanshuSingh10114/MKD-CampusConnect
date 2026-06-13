require('dotenv').config();
const mongoose = require('mongoose');
const { Student, Payment, FeeStructure, Admission } = require('./src/models');
const xlsx = require('xlsx');

const importPayments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const wb = xlsx.readFile('MKD_100_Students_Payments.xlsx');
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const item of data) {
      // Check if payment exists
      const existing = await Payment.findOne({ receiptNumber: item.ReceiptNumber });
      if (existing) {
        console.log(`Receipt ${item.ReceiptNumber} already exists. Skipping.`);
        continue;
      }

      const student = await Student.findOne({ admissionNumber: item.AdmissionNumber });
      if (!student) {
        console.log(`Student ${item.AdmissionNumber} not found! Skipping payment.`);
        continue;
      }

      const admission = await Admission.findOne({ student: student._id });
      if (!admission) {
        console.log(`Admission record not found for student ${item.AdmissionNumber}. Skipping.`);
        continue;
      }

      const feeStructure = await FeeStructure.findOne({ course: admission.course });
      const totalFee = feeStructure ? feeStructure.totalFee : 0;

      const previousPayments = await Payment.find({ student: student._id });
      const totalPaidSoFar = previousPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);

      const newDue = totalFee - (totalPaidSoFar + item.AmountPaid);

      const payment = new Payment({
        student: student._id,
        admissionNumber: student.admissionNumber,
        receiptNumber: item.ReceiptNumber,
        paymentDate: new Date(item.PaymentDate),
        paymentMode: item.PaymentMode,
        transactionId: item.TransactionId,
        amountPaid: item.AmountPaid,
        totalFee: totalFee,
        dueAmount: newDue > 0 ? newDue : 0,
        installmentNumber: previousPayments.length + 1,
        remarks: item.Remarks
      });

      await payment.save();
      console.log(`Imported payment ${item.ReceiptNumber} for ${student.personalDetails.studentName}`);
    }

    console.log('Payment import complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing payments:', error);
    process.exit(1);
  }
};

importPayments();
