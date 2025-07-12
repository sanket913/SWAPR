import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: [
      'swap_request', 'swap_accepted', 'swap_rejected', 'review', 
      'admin_announcement', 'message', 'reminder', 'badge_earned', 
      'level_up', 'event_invitation'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed,
  actionUrl: String
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// ✅ Export using ES module syntax
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
