const { Student, Admission, Payment, FeeStructure } = require('../../models');

const asyncHandler = require('../../shared/middlewares/async.middleware');

const getDashboardStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalStudents,
      totalAdmissions,
      newAdmissions,
      revenueResult,
      todaysCollectionResult,
      thisMonthsCollectionResult,
      monthlyRevenue,
      admissionsByCourse,
      feeCollectionMode,
      recentAdmissions,
      recentPayments,
      defaultersData,
      topDefaulters,
      courseRevenue
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      Admission.countDocuments(),
      Admission.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Payment.aggregate([{ $match: { paymentDate: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Payment.aggregate([{ $match: { paymentDate: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      
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
      ]),
      // Top Defaulters (Top 5)
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
        { $match: { pendingFee: { $gt: 0 } } },
        { $sort: { pendingFee: -1 } },
        { $limit: 5 },
        {
          $project: {
            studentName: '$personalDetails.studentName',
            admissionNumber: 1,
            course: '$admissions.course',
            pendingFee: 1
          }
        }
      ]),

      // Course-wise Revenue
      Payment.aggregate([
        {
          $lookup: {
            from: 'admissions',
            localField: 'student',
            foreignField: 'student',
            as: 'admission'
          }
        },
        { $unwind: { path: '$admission', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$admission.course',
            amount: { $sum: '$amountPaid' }
          }
        }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const pendingFees = defaultersData.length > 0 ? defaultersData[0].totalPending : 0;
    const defaultersCount = defaultersData.length > 0 ? defaultersData[0].defaultersCount : 0;

    const todaysCollection = todaysCollectionResult.length > 0 ? todaysCollectionResult[0].total : 0;
    const thisMonthsCollection = thisMonthsCollectionResult.length > 0 ? thisMonthsCollectionResult[0].total : 0;

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

    const formattedCourseRevenue = courseRevenue.map(item => ({
      name: item._id || 'Unknown',
      amount: item.amount
    }));

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmissions,
        newAdmissions,
        totalRevenue,
        todaysCollection,
        thisMonthsCollection,
        pendingFees,
        defaultersCount,
        monthlyRevenue: formattedMonthlyRevenue,
        admissionsByCourse: formattedAdmissionsByCourse,
        feeCollectionMode: formattedFeeCollectionMode,
        courseRevenue: formattedCourseRevenue,
        recentAdmissions,
        recentPayments,
        topDefaulters
      }
    });
});

module.exports = { getDashboardStats };
