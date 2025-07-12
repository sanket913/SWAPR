const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to transform user data
const transformUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    id: userObj._id.toString(),
    skillsOffered: userObj.skillsOffered.map(skill => skill.name || skill),
    skillsWanted: userObj.skillsWanted.map(skill => skill.name || skill),
    availability: userObj.availability.map(slot => slot.description || slot),
    joinedDate: userObj.createdAt
  };
};

// Get all users (public profiles only)
router.get('/', async (req, res) => {
  try {
    const { search, skillType, location, limit = 50, page = 1 } = req.query;
    
    let query = { isPublic: true, isAdmin: false };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { 'skillsOffered.name': { $regex: search, $options: 'i' } },
        { 'skillsWanted.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password -email')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Transform users for frontend
    const transformedUsers = users.map(transformUser);

    res.json({
      users: transformedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    
    if (!user || (!user.isPublic && !user.isAdmin)) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(transformUser(user));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    delete updates.email; // Don't allow email updates here
    delete updates.isAdmin; // Don't allow admin status changes

    // Process skills if they are being updated
    if (updates.skillsOffered) {
      updates.skillsOffered = Array.isArray(updates.skillsOffered) 
        ? updates.skillsOffered.filter(skill => skill && skill.trim()).map(skill => {
            if (typeof skill === 'string') {
              return {
                name: skill.trim(),
                category: 'General',
                level: 'intermediate',
                tags: [],
                description: ''
              };
            }
            return skill;
          })
        : [];
    }

    if (updates.skillsWanted) {
      updates.skillsWanted = Array.isArray(updates.skillsWanted) 
        ? updates.skillsWanted.filter(skill => skill && skill.trim()).map(skill => {
            if (typeof skill === 'string') {
              return {
                name: skill.trim(),
                category: 'General',
                level: 'beginner',
                tags: [],
                description: ''
              };
            }
            return skill;
          })
        : [];
    }

    // Process availability if it's being updated
    if (updates.availability) {
      updates.availability = Array.isArray(updates.availability) 
        ? updates.availability.filter(slot => slot && slot.trim()).map(slot => {
            if (typeof slot === 'string') {
              return {
                dayOfWeek: 0,
                startTime: '09:00',
                endTime: '17:00',
                timezone: 'UTC',
                recurring: true,
                description: slot.trim()
              };
            }
            return slot;
          })
        : [];
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(transformUser(user));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { search, status, limit = 50, page = 1 } = req.query;
    
    let query = { isAdmin: false };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') {
      query.isPublic = true;
    } else if (status === 'inactive') {
      query.isPublic = false;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Transform users for frontend
    const transformedUsers = users.map(user => ({
      ...transformUser(user),
      email: user.email // Include email for admin view
    }));

    res.json({
      users: transformedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update user
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here

    // Process skills if they are being updated
    if (updates.skillsOffered) {
      updates.skillsOffered = Array.isArray(updates.skillsOffered) 
        ? updates.skillsOffered.filter(skill => skill && skill.trim()).map(skill => {
            if (typeof skill === 'string') {
              return {
                name: skill.trim(),
                category: 'General',
                level: 'intermediate',
                tags: [],
                description: ''
              };
            }
            return skill;
          })
        : [];
    }

    if (updates.skillsWanted) {
      updates.skillsWanted = Array.isArray(updates.skillsWanted) 
        ? updates.skillsWanted.filter(skill => skill && skill.trim()).map(skill => {
            if (typeof skill === 'string') {
              return {
                name: skill.trim(),
                category: 'General',
                level: 'beginner',
                tags: [],
                description: ''
              };
            }
            return skill;
          })
        : [];
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(transformUser(user));
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete user
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;