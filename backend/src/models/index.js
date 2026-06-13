const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Principal', 'Admission Staff', 'Accounts Staff'] },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
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
    alternateMobile: String,
    email: String,
    aadhaarNumber: String,
    category: String
  },
  addressDetails: {
    address: String,
    correspondenceAddress: String,
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

studentSchema.index({ 'personalDetails.studentName': 1 });

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

admissionSchema.index({ student: 1 });
admissionSchema.index({ course: 1, session: 1 });

const Admission = mongoose.model('Admission', admissionSchema);

const feeStructureSchema = new mongoose.Schema({
  course: { type: String, enum: ['B.Ed', 'BTC / D.El.Ed', 'ITI'], required: true },
  academicYear: { type: String, required: true }, // e.g. "2026-2027"
  admissionFee: { type: Number, default: 0 },
  tuitionFee: { type: Number, default: 0 },
  examFee: { type: Number, default: 0 },
  libraryFee: { type: Number, default: 0 },
  developmentFee: { type: Number, default: 0 },
  workshopFee: { type: Number, default: 0 },
  labFee: { type: Number, default: 0 },
  otherFee: { type: Number, default: 0 },
  totalFee: { type: Number, default: 0 }
}, { timestamps: true });

feeStructureSchema.index({ course: 1, academicYear: 1 }, { unique: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNumber: String,
  receiptNumber: { type: String, unique: true },
  paymentDate: Date,
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Demand Draft'] },
  transactionId: String,
  amountPaid: Number,
  totalFee: Number,
  dueAmount: Number,
  installmentNumber: Number,
  remarks: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

paymentSchema.index({ student: 1 });
paymentSchema.index({ paymentDate: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

const settingsSchema = new mongoose.Schema({
  institution: {
    name: { type: String, default: 'M.K.D. Group of Education' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    logo: { type: String, default: '' }
  },
  receipt: {
    prefix: { type: String, default: 'REC-' },
    termsAndConditions: { type: String, default: 'Fees once paid will not be refunded.' }
  },
  admission: {
    prefix: { type: String, default: 'MKD-' },
    currentSession: { type: String, default: '2026-2027' }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = { User, Student, Admission, FeeStructure, Payment, Settings };
