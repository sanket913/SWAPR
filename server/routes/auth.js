const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, skillsOffered, skillsWanted, availability } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Process skills - ensure they are arrays of strings
    const processedSkillsOffered = Array.isArray(skillsOffered) 
      ? skillsOffered.filter(skill => skill && skill.trim()).map(skill => ({
          name: skill.trim(),
          category: 'General',
          level: 'intermediate',
          tags: [],
          description: ''
        }))
      : [];

    const processedSkillsWanted = Array.isArray(skillsWanted) 
      ? skillsWanted.filter(skill => skill && skill.trim()).map(skill => ({
          name: skill.trim(),
          category: 'General',
          level: 'beginner',
          tags: [],
          description: ''
        }))
      : [];

    // Process availability - ensure it's an array
    const processedAvailability = Array.isArray(availability) 
      ? availability.filter(slot => slot && slot.trim()).map(slot => ({
          dayOfWeek: 0,
          startTime: '09:00',
          endTime: '17:00',
          timezone: 'UTC',
          recurring: true,
          description: slot.trim()
        }))
      : [];

    // Create user with proper data structure
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      location: location ? location.trim() : '',
      skillsOffered: processedSkillsOffered,
      skillsWanted: processedSkillsWanted,
      availability: processedAvailability,
      isAdmin: email.toLowerCase() === 'admin@swapr.com',
      isPublic: true,
      rating: 5.0,
      totalReviews: 0,
      badges: [],
      points: 0,
      streak: 0,
      level: 1,
      verifications: [],
      stats: {
        totalSwaps: 0,
        completedSwaps: 0,
        hoursLearned: 0,
        hoursTaught: 0,
        favoriteSkills: [],
        monthlyActivity: []
      },
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          inApp: true,
          swapRequests: true,
          messages: true,
          reminders: true,
          marketing: false
        },
        privacy: {
          showLocation: true,
          showOnlineStatus: true,
          allowDirectMessages: true,
          showInSearch: true
        },
        matching: {
          maxDistance: 50,
          preferredMeetingType: 'both',
          skillLevelPreference: 'any',
          availabilityFlexibility: 'flexible'
        }
      }
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    // Transform the response to match frontend expectations
    const transformedUser = {
      ...userResponse,
      id: userResponse._id.toString(),
      skillsOffered: userResponse.skillsOffered.map(skill => skill.name || skill),
      skillsWanted: userResponse.skillsWanted.map(skill => skill.name || skill),
      availability: userResponse.availability.map(slot => slot.description || slot),
      joinedDate: userResponse.createdAt
    };

    res.status(201).json({
      token,
      user: transformedUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    // Transform the response to match frontend expectations
    const transformedUser = {
      ...userResponse,
      id: userResponse._id.toString(),
      skillsOffered: userResponse.skillsOffered.map(skill => skill.name || skill),
      skillsWanted: userResponse.skillsWanted.map(skill => skill.name || skill),
      availability: userResponse.availability.map(slot => slot.description || slot),
      joinedDate: userResponse.createdAt
    };

    res.json({
      token,
      user: transformedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Transform the response to match frontend expectations
    const transformedUser = {
      ...user.toObject(),
      id: user._id.toString(),
      skillsOffered: user.skillsOffered.map(skill => skill.name || skill),
      skillsWanted: user.skillsWanted.map(skill => skill.name || skill),
      availability: user.availability.map(slot => slot.description || slot),
      joinedDate: user.createdAt
    };

    res.json(transformedUser);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isOnline = false;
      await user.save();
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;