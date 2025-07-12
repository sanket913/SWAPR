import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user's swap requests
router.get('/', auth, async (req, res) => {
  try {
    const { type = 'all', status = 'all', limit = 50, page = 1 } = req.query;

    let query = {};

    if (type === 'sent') {
      query.fromUserId = req.user._id;
    } else if (type === 'received') {
      query.toUserId = req.user._id;
    } else {
      query.$or = [
        { fromUserId: req.user._id },
        { toUserId: req.user._id }
      ];
    }

    if (status !== 'all') {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('fromUserId', 'name email profilePhoto')
      .populate('toUserId', 'name email profilePhoto')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 });

    const total = await SwapRequest.countDocuments(query);

    res.json({
      swaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create swap request
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, skillOffered, skillWanted, message, duration, meetingType, location } = req.body;

    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const swapRequest = new SwapRequest({
      fromUserId: req.user._id,
      toUserId,
      skillOffered,
      skillWanted,
      message,
      duration: duration || 60,
      meetingType: meetingType || 'video',
      location
    });

    await swapRequest.save();

    const notification = new Notification({
      userId: toUserId,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${req.user.name} wants to swap ${skillOffered} for ${skillWanted}`,
      data: { swapRequestId: swapRequest._id }
    });

    await notification.save();

    await swapRequest.populate('fromUserId', 'name email profilePhoto');
    await swapRequest.populate('toUserId', 'name email profilePhoto');

    res.status(201).json(swapRequest);
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update swap request
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, scheduledAt } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (
      swapRequest.toUserId.toString() !== req.user._id.toString() &&
      swapRequest.fromUserId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) swapRequest.status = status;
    if (scheduledAt) swapRequest.scheduledAt = scheduledAt;

    await swapRequest.save();

    if (status) {
      const targetUserId = swapRequest.fromUserId.toString() === req.user._id.toString()
        ? swapRequest.toUserId
        : swapRequest.fromUserId;

      let notificationTitle, notificationMessage;

      switch (status) {
        case 'accepted':
          notificationTitle = 'Swap Request Accepted';
          notificationMessage = `${req.user.name} accepted your swap request`;
          break;
        case 'rejected':
          notificationTitle = 'Swap Request Declined';
          notificationMessage = `${req.user.name} declined your swap request`;
          break;
        case 'completed':
          notificationTitle = 'Swap Completed';
          notificationMessage = `Your swap with ${req.user.name} has been marked as completed`;
          break;
      }

      if (notificationTitle) {
        const notification = new Notification({
          userId: targetUserId,
          type: `swap_${status}`,
          title: notificationTitle,
          message: notificationMessage,
          data: { swapRequestId: swapRequest._id }
        });

        await notification.save();
      }
    }

    await swapRequest.populate('fromUserId', 'name email profilePhoto');
    await swapRequest.populate('toUserId', 'name email profilePhoto');

    res.json(swapRequest);
  } catch (error) {
    console.error('Update swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete swap request
router.delete('/:id', auth, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.fromUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SwapRequest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    console.error('Delete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all swap requests
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('fromUserId', 'name email profilePhoto')
      .populate('toUserId', 'name email profilePhoto')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 });

    const total = await SwapRequest.countDocuments(query);

    res.json({
      swaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin get swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ESM Export
export default router;
