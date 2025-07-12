const mongoose = require('mongoose');

const swapTermsSchema = new mongoose.Schema({
  duration: { type: Number, required: true }, // in minutes
  expectations: String,
  materials: [String],
  prerequisites: [String],
  deliverables: [String],
  cancellationPolicy: String
});

const swapRequestSchema = new mongoose.Schema({
  fromUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  toUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  skillOffered: { type: String, required: true },
  skillWanted: { type: String, required: true },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Advanced features
  scheduledAt: Date,
  duration: { type: Number, default: 60 }, // in minutes
  meetingType: {
    type: String,
    enum: ['in-person', 'video', 'chat'],
    default: 'video'
  },
  location: String,
  videoRoomId: String,
  terms: swapTermsSchema,
  pointsOffered: Number,
  pointsRequested: Number
}, {
  timestamps: true
});

// Indexes
swapRequestSchema.index({ fromUserId: 1, status: 1 });
swapRequestSchema.index({ toUserId: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);