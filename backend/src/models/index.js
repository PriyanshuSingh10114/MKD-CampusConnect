const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Principal', 'Admission Staff', 'Accounts Staff'] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const studentSchema = new mongoose.Schema({
  admissionNumber: { type: String, unique: true }, // Format: MKD-2026-0001
  personalDetails: {
    studentName: String,
    fatherName: String,
    motherName: String,
    gender: String,
    dob: Date,
    mobile: String,
    email: String,
    aadhaarNumber: String
  },
  addressDetails: {
    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String
  },
  academicDetails: {
    previousSchool: String,
    tenthMarks: Number,
    twelfthMarks: Number
  },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

const admissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  course: { type: String, enum: ['B.Ed', 'BTC / D.El.Ed', 'ITI'] },
  session: String,
  admissionDate: Date,
  documents: {
    photo: String,
    aadhaar: String,
    marksheet: String
  }
}, { timestamps: true });

const Admission = mongoose.model('Admission', admissionSchema);

const feeStructureSchema = new mongoose.Schema({
  course: { type: String, enum: ['B.Ed', 'BTC / D.El.Ed', 'ITI'] },
  admissionFee: Number,
  tuitionFee: Number,
  examFee: Number,
  libraryFee: Number,
  developmentFee: Number,
  totalFee: Number
}, { timestamps: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  receiptNumber: { type: String, unique: true },
  paymentDate: Date,
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'] },
  amountPaid: Number,
  totalFee: Number,
  dueAmount: Number,
  installmentNumber: Number,
  remarks: String
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { User, Student, Admission, FeeStructure, Payment };
