const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../../shared/middlewares/async.middleware');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role
  });

  await user.save();
  res.status(201).json({ success: true, message: 'User created successfully' });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user, message: 'User updated successfully' });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (req.user.id === req.params.id) {
    return res.status(400).json({ success: false, message: 'You cannot change your own status' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user, message: 'User status updated successfully' });
});

const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: hashedPassword }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

module.exports = { getUsers, createUser, updateUser, updateUserStatus, resetUserPassword };
