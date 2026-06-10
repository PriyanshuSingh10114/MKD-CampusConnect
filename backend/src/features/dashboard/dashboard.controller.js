const { Student, Admission, Payment, FeeStructure } = require('../../models');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    // new admissions this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newAdmissions = await Admission.countDocuments({ createdAt: { $gte: startOfMonth } });

    // total revenue
    const revenueResult = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const activeCourses = await FeeStructure.countDocuments();

    // monthly revenue
    const monthlyRevenue = await Payment.aggregate([
      {
        $group: {
          _id: { $month: '$paymentDate' },
          amount: { $sum: '$amountPaid' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: '$_id',
          amount: 1,
          _id: 0
        }
      }
    ]);

    // admissions by course
    const admissionsByCourse = await Admission.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          course: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        newAdmissions,
        totalRevenue,
        activeCourses,
        monthlyRevenue,
        admissionsByCourse
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
