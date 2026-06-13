const { Payment, Admission, Student, FeeStructure } = require('../../models');
const mongoose = require('mongoose');

const asyncHandler = require('../../shared/middlewares/async.middleware');

const getDashboardStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRevenueData,
      todayCollectionData,
      monthlyCollectionData,
      totalStudentsData,
      defaultersCountData,
      revenueTrendData,
      admissionsTrendData,
      courseRevenueData
    ] = await Promise.all([
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Payment.aggregate([
        { $match: { paymentDate: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      Payment.aggregate([
        { 
          $match: { 
            paymentDate: { 
              $gte: new Date(today.getFullYear(), today.getMonth(), 1) 
            } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      Student.countDocuments({ status: 'Active' }),
      Payment.countDocuments({ dueAmount: { $gt: 0 } }), // simplified defaulters count for dashboard
      
      // Revenue Trend (last 6 months)
      Payment.aggregate([
        {
          $group: {
            _id: { month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } },
            total: { $sum: '$amountPaid' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 }
      ]),

      // Admissions Trend (by course)
      Admission.aggregate([
        {
          $group: {
            _id: '$course',
            students: { $sum: 1 }
          }
        }
      ]),

      // Course Revenue
      Payment.aggregate([
        {
          $lookup: {
            from: 'admissions',
            localField: 'student',
            foreignField: 'student',
            as: 'admissions'
          }
        },
        { $unwind: { path: '$admissions', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$admissions.course',
            total: { $sum: '$amountPaid' }
          }
        }
      ])
    ]);

    const formatMonth = (monthNum) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[monthNum - 1] || '';
    };

    const formattedRevenueTrend = revenueTrendData.map(item => ({
      name: `${formatMonth(item._id.month)} ${item._id.year}`,
      total: item.total
    }));

    const formattedAdmissionsTrend = admissionsTrendData.map(item => ({
      name: item._id || 'Unknown',
      students: item.students
    }));

    const formattedCourseRevenue = courseRevenueData.map(item => ({
      name: item._id || 'Unknown',
      total: item.total
    }));

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenueData[0]?.total || 0,
        todayCollection: todayCollectionData[0]?.total || 0,
        monthlyCollection: monthlyCollectionData[0]?.total || 0,
        totalStudents: totalStudentsData,
        defaultersCount: defaultersCountData,
        revenueTrend: formattedRevenueTrend,
        admissionsTrend: formattedAdmissionsTrend,
        courseRevenue: formattedCourseRevenue
      }
    });
});

const getDailyCollection = asyncHandler(async (req, res) => {
    const { date } = req.query;
    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.paymentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const payments = await Payment.find(query).populate('student', 'personalDetails.studentName admissionNumber').sort({ paymentDate: -1 });
    
    const totalAmount = payments.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const totalTransactions = payments.length;

    res.status(200).json({ success: true, data: { date: date || new Date().toISOString().split('T')[0], totalTransactions, totalAmount, payments } });
});

const getMonthlyCollection = asyncHandler(async (req, res) => {
    const data = await Payment.aggregate([
      {
        $group: {
          _id: { month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } },
          totalRevenue: { $sum: '$amountPaid' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.status(200).json({ success: true, data });
});

const getCourseRevenue = asyncHandler(async (req, res) => {
    const data = await Payment.aggregate([
      {
        $lookup: {
          from: 'admissions',
          localField: 'student',
          foreignField: 'student',
          as: 'admissions'
        }
      },
      { $unwind: { path: '$admissions', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$admissions.course',
          totalRevenue: { $sum: '$amountPaid' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
    res.status(200).json({ success: true, data });
});

const getAdmissionsReport = asyncHandler(async (req, res) => {
    const data = await Admission.aggregate([
      {
        $group: {
          _id: { course: '$course', session: '$session' },
          totalAdmissions: { $sum: 1 }
        }
      },
      { $sort: { '_id.session': -1, '_id.course': 1 } }
    ]);
    res.status(200).json({ success: true, data });
});

const getStudentLedger = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    
    const isObjectId = studentId.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: studentId } : { admissionNumber: studentId };
    
    const student = await Student.findOne(query);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const payments = await Payment.find({ student: student._id }).sort({ paymentDate: 1 }).populate('collectedBy', 'name');
    
    res.status(200).json({ 
      success: true, 
      data: {
        student: {
          name: student.personalDetails?.studentName,
          admissionNumber: student.admissionNumber,
          mobile: student.personalDetails?.mobile
        },
        payments
      }
    });
});

module.exports = { 
  getDashboardStats, 
  getDailyCollection, 
  getMonthlyCollection, 
  getCourseRevenue, 
  getAdmissionsReport, 
  getStudentLedger 
};
