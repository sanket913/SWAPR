const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  tags: [String],
  description: String,
  yearsOfExperience: Number,
  certifications: [String]
});

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, min: 0, max: 6, default: 0 }, // 0-6 (Sunday-Saturday)
  startTime: { type: String, default: '09:00' }, // HH:MM format
  endTime: { type: String, default: '17:00' },
  timezone: { type: String, default: 'UTC' },
  recurring: { type: Boolean, default: true },
  description: String // For simple text descriptions like "Weekends", "Evenings"
});

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['skill', 'engagement', 'community', 'achievement'],
    default: 'achievement'
  },
  earnedAt: { type: Date, default: Date.now },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

const verificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'phone', 'linkedin', 'github'],
    required: true
  },
  verified: { type: Boolean, default: false },
  verifiedAt: Date,
  data: mongoose.Schema.Types.Mixed
});

const userStatsSchema = new mongoose.Schema({
  totalSwaps: { type: Number, default: 0 },
  completedSwaps: { type: Number, default: 0 },
  hoursLearned: { type: Number, default: 0 },
  hoursTaught: { type: Number, default: 0 },
  favoriteSkills: [String],
  monthlyActivity: [{
    month: String,
    swaps: Number,
    hours: Number,
    newSkills: Number
  }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  location: { type: String, trim: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  profilePhoto: { type: String, trim: true },
  skillsOffered: [skillSchema],
  skillsWanted: [skillSchema],
  availability: [availabilitySlotSchema],
  isPublic: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  
  // Advanced features
  badges: [badgeSchema],
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  verifications: [verificationSchema],
  stats: { type: userStatsSchema, default: () => ({}) },
  lastActive: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  
  // Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      swapRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      showLocation: { type: Boolean, default: true },
      showOnlineStatus: { type: Boolean, default: true },
      allowDirectMessages: { type: Boolean, default: true },
      showInSearch: { type: Boolean, default: true }
    },
    matching: {
      maxDistance: { type: Number, default: 50 },
      preferredMeetingType: { 
        type: String, 
        enum: ['in-person', 'video', 'both'], 
        default: 'both' 
      },
      skillLevelPreference: { 
        type: String, 
        enum: ['any', 'similar', 'higher'], 
        default: 'any' 
      },
      availabilityFlexibility: { 
        type: String, 
        enum: ['strict', 'flexible'], 
        default: 'flexible' 
      }
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ name: 'text', email: 'text', location: 'text' });
userSchema.index({ 'skillsOffered.name': 'text', 'skillsWanted.name': 'text' });

// Pre-save middleware to ensure proper data structure
userSchema.pre('save', function(next) {
  // Ensure stats object exists
  if (!this.stats) {
    this.stats = {
      totalSwaps: 0,
      completedSwaps: 0,
      hoursLearned: 0,
      hoursTaught: 0,
      favoriteSkills: [],
      monthlyActivity: []
    };
  }

  // Ensure preferences object exists
  if (!this.preferences) {
    this.preferences = {
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
    };
  }

  next();
});

module.exports = mongoose.model('User', userSchema);