const { Student, Admission, Payment, FeeStructure } = require('../../models');

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalStudents,
      newAdmissions,
      revenueResult,
      monthlyRevenue,
      admissionsByCourse,
      feeCollectionMode,
      recentAdmissions,
      recentPayments,
      defaultersData
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      Admission.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      
      // Monthly Revenue (Last 6 Months)
      Payment.aggregate([
        {
          $group: {
            _id: { month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } },
            amount: { $sum: '$amountPaid' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 }
      ]),

      // Admissions by Course
      Admission.aggregate([
        {
          $group: {
            _id: '$course',
            count: { $sum: 1 }
          }
        }
      ]),

      // Fee Collection by Mode
      Payment.aggregate([
        {
          $group: {
            _id: '$paymentMode',
            amount: { $sum: '$amountPaid' }
          }
        }
      ]),

      // Recent Admissions (Top 5)
      Admission.find().sort({ admissionDate: -1, createdAt: -1 }).limit(5).populate('student', 'personalDetails.studentName admissionNumber'),

      // Recent Payments (Top 5)
      Payment.find().sort({ paymentDate: -1, createdAt: -1 }).limit(5).populate('student', 'personalDetails.studentName admissionNumber'),

      // Pending Fees & Defaulters Count
      Student.aggregate([
        { $match: { status: 'Active' } },
        {
          $lookup: {
            from: 'admissions',
            localField: '_id',
            foreignField: 'student',
            as: 'admissions'
          }
        },
        { $unwind: { path: '$admissions', preserveNullAndEmptyArrays: true } },
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
            paidFee: { $sum: '$payments.amountPaid' }
          }
        },
        {
          $addFields: {
            pendingFee: { $subtract: ['$totalFee', '$paidFee'] }
          }
        },
        {
          $group: {
            _id: null,
            totalPending: { $sum: { $cond: [{ $gt: ['$pendingFee', 0] }, '$pendingFee', 0] } },
            defaultersCount: { $sum: { $cond: [{ $gt: ['$pendingFee', 0] }, 1, 0] } }
          }
        }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const pendingFees = defaultersData.length > 0 ? defaultersData[0].totalPending : 0;
    const defaultersCount = defaultersData.length > 0 ? defaultersData[0].defaultersCount : 0;

    const formatMonth = (monthNum) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[monthNum - 1] || '';
    };

    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      name: `${formatMonth(item._id.month)} ${item._id.year}`,
      total: item.amount
    }));

    const formattedAdmissionsByCourse = admissionsByCourse.map(item => ({
      name: item._id || 'Unknown',
      students: item.count
    }));

    const formattedFeeCollectionMode = feeCollectionMode.map(item => ({
      name: item._id || 'Unknown',
      amount: item.amount
    }));

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        newAdmissions,
        totalRevenue,
        pendingFees,
        defaultersCount,
        monthlyRevenue: formattedMonthlyRevenue,
        admissionsByCourse: formattedAdmissionsByCourse,
        feeCollectionMode: formattedFeeCollectionMode,
        recentAdmissions,
        recentPayments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
