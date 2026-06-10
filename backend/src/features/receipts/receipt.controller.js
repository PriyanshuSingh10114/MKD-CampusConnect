const { Payment } = require('../../models');

const generateReceipt = async (req, res, next) => {
  try {
    const { installmentId } = req.params;
    
    // Simplified logic: finding payment that matches the installment
    // Assuming installmentId is actually the receiptNumber for this simplified mock
    const payment = await Payment.findOne({ receiptNumber: installmentId }).populate('student');

    if (!payment) return res.status(404).json({ success: false, message: 'Receipt not found' });

    const mockPdfUrl = `https://s3.aws.com/college-erp/receipts/${payment.receiptNumber}.pdf`;

    res.status(200).json({ success: true, data: { ...payment.toObject(), pdfUrl: mockPdfUrl } });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateReceipt };
