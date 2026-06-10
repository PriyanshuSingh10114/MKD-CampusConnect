const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

const authRoutes = require('./features/auth/auth.routes');
const studentRoutes = require('./features/students/student.routes');
const admissionRoutes = require('./features/admissions/admission.routes');
const feeRoutes = require('./features/fees/fee.routes');
const receiptRoutes = require('./features/receipts/receipt.routes');
const reportRoutes = require('./features/reports/report.routes');
const logRoutes = require('./features/logs/log.routes');
const dashboardRoutes = require('./features/dashboard/dashboard.routes');
const { sendError } = require('./shared/middlewares/error.middleware');

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(sendError);

module.exports = app;
