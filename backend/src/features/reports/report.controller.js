const { Payment } = require('../../models');

const getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query);
    
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const totalDue = payments.reduce((acc, curr) => acc + curr.dueAmount, 0);

    res.status(200).json({ success: true, data: { totalRevenue, totalDue, records: payments.length } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRevenueReport };
