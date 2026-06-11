const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // User login from DB

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, email: user.email, role: user.role, name: user.name }
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Password reset link sent' });
};

const resetPassword = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Password reset successfully' });
};

module.exports = { login, forgotPassword, resetPassword };
