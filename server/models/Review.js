import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  swapRequestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SwapRequest', 
    required: true 
  },
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  revieweeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: String,

  // Detailed feedback
  skillRating: { type: Number, min: 1, max: 5 },
  communicationRating: { type: Number, min: 1, max: 5 },
  punctualityRating: { type: Number, min: 1, max: 5 },
  helpfulnessRating: { type: Number, min: 1, max: 5 },
  tags: [String],
  wouldSwapAgain: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ revieweeId: 1, createdAt: -1 });
reviewSchema.index({ reviewerId: 1, createdAt: -1 });
reviewSchema.index({ swapRequestId: 1 });

// ✅ Export using ES Module syntax
const Review = mongoose.model('Review', reviewSchema);
export default Review;
