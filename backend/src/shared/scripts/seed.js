const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const {
  User,
  Student,
  Admission,
  FeeStructure,
  Payment,
} = require('../../models');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp'
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');

    await User.deleteMany({});
    await Student.deleteMany({});
    await Admission.deleteMany({});
    await Payment.deleteMany({});

    // Keep this only if you want default fee structures
    await FeeStructure.deleteMany({});

    console.log('Creating Admin User...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name: 'Super Admin',
      email: 'admin@college.edu',
      password: hashedPassword,
      role: 'Super Admin',
    });

    console.log('Creating Default Fee Structures...');

    await FeeStructure.insertMany([
      {
        course: 'B.Ed',
        academicYear: '2026-2027',
        admissionFee: 5000,
        tuitionFee: 40000,
        examFee: 2000,
        libraryFee: 1000,
        developmentFee: 2000,
        totalFee: 50000,
      },
      {
        course: 'BTC / D.El.Ed',
        academicYear: '2026-2027',
        admissionFee: 4000,
        tuitionFee: 35000,
        examFee: 2000,
        libraryFee: 1000,
        developmentFee: 2000,
        totalFee: 44000,
      },
      {
        course: 'ITI',
        academicYear: '2026-2027',
        admissionFee: 3000,
        tuitionFee: 20000,
        examFee: 1500,
        libraryFee: 500,
        developmentFee: 1000,
        totalFee: 26000,
      },
    ]);

    console.log('Seed Completed Successfully');
    console.log('');
    console.log('Login Credentials');
    console.log('----------------');
    console.log('Email    : admin@college.edu');
    console.log('Password : admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();