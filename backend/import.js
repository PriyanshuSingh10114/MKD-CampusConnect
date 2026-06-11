require('dotenv').config();
const mongoose = require('mongoose');
const { Student, Admission } = require('./src/models');
const fs = require('fs');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const data = JSON.parse(fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/eb18cfc1-ddea-41cd-95d7-4db9c488961c/scratch/excel/data_utf8.json', 'utf-8'));

    for (const item of data) {
      // Check if student exists
      const existing = await Student.findOne({ admissionNumber: item.AdmissionNumber });
      if (existing) {
        console.log(`Student ${item.AdmissionNumber} already exists. Skipping.`);
        continue;
      }

      let course = item.Course;
      if (course === 'D.El.Ed') {
        course = 'BTC / D.El.Ed';
      }

      const student = new Student({
        admissionNumber: item.AdmissionNumber,
        personalDetails: {
          studentName: item.StudentName,
          fatherName: item.FatherName,
          motherName: item.MotherName,
          gender: item.Gender,
          dob: item.DOB ? new Date(item.DOB) : null,
          mobile: item.Mobile?.toString(),
          aadhaarNumber: item.Aadhaar?.toString()
        },
        addressDetails: {
          address: item.Address,
          city: item.City
        },
        status: 'Active'
      });

      await student.save();

      const admission = new Admission({
        student: student._id,
        course: course,
        session: item.Session,
        admissionDate: new Date()
      });

      await admission.save();
      console.log(`Imported ${item.AdmissionNumber} - ${item.StudentName}`);
    }

    console.log('Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
