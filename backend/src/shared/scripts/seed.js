const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { User, Student, Admission, FeeStructure, Payment } = require('../../models');

// Load env vars from the root of the backend
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await User.deleteMany();
    await Student.deleteMany();
    await Admission.deleteMany();
    await FeeStructure.deleteMany();
    await Payment.deleteMany();

    console.log('Creating Admin User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@college.edu',
      password: hashedPassword,
      role: 'Super Admin'
    });

    console.log('Creating Fee Structures...');
    const feeStructures = await FeeStructure.insertMany([
      { course: 'B.Ed', academicYear: '2026-2027', admissionFee: 5000, tuitionFee: 40000, examFee: 2000, libraryFee: 1000, developmentFee: 2000, totalFee: 50000 },
      { course: 'BTC / D.El.Ed', academicYear: '2026-2027', admissionFee: 4000, tuitionFee: 35000, examFee: 2000, libraryFee: 1000, developmentFee: 2000, totalFee: 44000 },
      { course: 'ITI', academicYear: '2026-2027', admissionFee: 3000, tuitionFee: 20000, examFee: 1500, libraryFee: 500, developmentFee: 1000, totalFee: 26000 }
    ]);

    console.log('Creating Dummy Students & Admissions...');
    const student1 = await Student.create({
      admissionNumber: 'MKD-2026-0001',
      personalDetails: { studentName: 'John Doe', gender: 'Male', email: 'john@example.com', mobile: '9876543210' },
      status: 'Active'
    });
    
    await Admission.create({
      student: student1._id,
      course: 'B.Ed',
      session: '2026-2028',
      admissionDate: new Date()
    });

    const student2 = await Student.create({
      admissionNumber: 'MKD-2026-0002',
      personalDetails: { studentName: 'Jane Smith', gender: 'Female', email: 'jane@example.com', mobile: '9123456789' },
      status: 'Active'
    });

    await Admission.create({
      student: student2._id,
      course: 'BTC / D.El.Ed',
      session: '2026-2028',
      admissionDate: new Date()
    });

    console.log('Creating Dummy Payments...');
    await Payment.create({
      student: student1._id,
      admissionNumber: student1.admissionNumber,
      receiptNumber: 'RCP-2026-00001',
      paymentDate: new Date(),
      paymentMode: 'UPI',
      amountPaid: 10000,
      totalFee: 50000,
      dueAmount: 40000,
      installmentNumber: 1,
      remarks: 'First installment',
      collectedBy: adminUser._id
    });

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
