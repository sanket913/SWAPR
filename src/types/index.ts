export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalReviews: number;
  joinedDate: string;
  isAdmin?: boolean;
  
  // New advanced features
  badges?: Badge[];
  points?: number;
  streak?: number;
  level?: number;
  verifications?: Verification[];
  certifications?: Certification[];
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  stats?: UserStats;
  lastActive?: string;
  isOnline?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'skill' | 'engagement' | 'community' | 'achievement';
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Verification {
  type: 'email' | 'phone' | 'linkedin' | 'github';
  verified: boolean;
  verifiedAt?: string;
  data?: any;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  matching: MatchingPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  swapRequests: boolean;
  messages: boolean;
  reminders: boolean;
  marketing: boolean;
}

export interface PrivacyPreferences {
  showLocation: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showInSearch: boolean;
}

export interface MatchingPreferences {
  maxDistance: number;
  preferredMeetingType: 'in-person' | 'video' | 'both';
  skillLevelPreference: 'any' | 'similar' | 'higher';
  availabilityFlexibility: 'strict' | 'flexible';
}

export interface UserStats {
  totalSwaps: number;
  completedSwaps: number;
  hoursLearned: number;
  hoursTaught: number;
  favoriteSkills: string[];
  monthlyActivity: MonthlyActivity[];
}

export interface MonthlyActivity {
  month: string;
  swaps: number;
  hours: number;
  newSkills: number;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  duration?: number;
  meetingType?: 'in-person' | 'video' | 'chat';
  location?: string;
  videoRoomId?: string;
  terms?: SwapTerms;
  pointsOffered?: number;
  pointsRequested?: number;
}

export interface SwapTerms {
  duration: number;
  expectations?: string;
  materials?: string[];
  prerequisites?: string[];
  deliverables?: string[];
  cancellationPolicy?: string;
}

export interface Review {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  skillRating?: number;
  communicationRating?: number;
  punctualityRating?: number;
  helpfulnessRating?: number;
  tags?: string[];
  wouldSwapAgain?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'review' | 'admin_announcement' | 
        'message' | 'reminder' | 'badge_earned' | 'level_up' | 'event_invitation';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
  actionUrl?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSwaps: number;
  pendingSwaps: number;
  completedSwaps: number;
  totalReviews: number;
  averageRating: number;
}