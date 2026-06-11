const { Payment, Admission } = require('../../models');

const getReceipts = async (req, res, next) => {
  try {
    const { search, startDate, endDate, page = 1, limit = 50 } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { receiptNumber: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
      // Note: Searching by student name requires a lookup or populate, which complicates simple find.
      // For full support, an aggregation could be used here.
    }

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.paymentDate.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const receipts = await Payment.find(query)
      .populate('student', 'personalDetails.studentName')
      .populate('collectedBy', 'name')
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Payment.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      data: receipts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getReceiptById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await Payment.findById(id)
      .populate('student')
      .populate('collectedBy', 'name');

    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });

    // Also get the course from Admission
    const admission = await Admission.findOne({ student: receipt.student._id });

    res.status(200).json({ 
      success: true, 
      data: {
        ...receipt.toObject(),
        course: admission?.course || 'Unknown Course'
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReceipts, getReceiptById };
