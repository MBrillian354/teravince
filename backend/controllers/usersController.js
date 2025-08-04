const User = require('../models/User');
const Job = require('../models/Job');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('jobId', 'title');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('jobId', 'title');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const updates = req.body;
      const userId = req.params.id;

      // Hash password if it's being updated
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      // Get the current user to check for jobId changes
      const currentUser = await User.findById(userId).populate('jobId', 'title').session(session);
      if (!currentUser) {
        throw new Error('User not found');
      }

      const oldJobId = currentUser.jobId;
      const newJobId = updates.jobId;

      // Handle job assignment changes
      if (oldJobId && oldJobId.toString() !== newJobId?.toString()) {
        // Remove user from old job's assignedTo array
        await Job.findByIdAndUpdate(
          oldJobId,
          { $pull: { assignedTo: userId } },
          { session }
        );
      }

      if (newJobId && newJobId.toString() !== oldJobId?.toString()) {
        // Verify the new job exists
        const newJob = await Job.findById(newJobId).session(session);
        if (!newJob) {
          throw new Error('Job not found');
        }

        // Add user to new job's assignedTo array if not already present
        await Job.findByIdAndUpdate(
          newJobId,
          { $addToSet: { assignedTo: userId } },
          { session }
        );
      }

      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, session }
      ).select('-password');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    });

    // Get the updated user after transaction completes
    const user = await User.findById(req.params.id).select('-password').populate('jobId', 'title');
    res.json({ msg: 'User updated successfully', user });

  } catch (err) {
    console.error('Error updating user:', err);
    res.status(err.message === 'User not found' || err.message === 'Job not found' ? 404 : 500)
      .json({ msg: err.message || 'Server error' });
  } finally {
    await session.endSession();
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
        profilePicture: user.profilePicture,
        address: user.address,
        contactInfo: user.contactInfo,
        jobTitle: user.jobId ? user.jobId.title : 'Unassigned',
        jobId: user.jobId ? user.jobId.toString() : null
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Upload user profilePicture
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ msg: 'No profilePicture uploaded' });
    }

    // Get the current user to remove old profilePicture if exists
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Remove old profilePicture file if exists
    if (currentUser.profilePicture) {
      const oldPhotoPath = path.join(__dirname, '..', currentUser.profilePicture);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user with new profilePicture path
    const profilePicturePath = `uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicturePath },
      { new: true }
    ).select('-password').populate('jobId', 'title');

    res.json({
      msg: 'Photo uploaded successfully',
      user: updatedUser,
      profilePictureUrl: `/${profilePicturePath}`
    });

  } catch (err) {
    console.error('Error uploading profilePicture:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
