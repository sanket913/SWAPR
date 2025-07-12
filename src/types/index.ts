export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  profilePhoto?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: AvailabilitySlot[];
  isPublic: boolean;
  rating: number;
  totalReviews: number;
  joinedDate: string;
  isAdmin?: boolean;
  
  // New advanced features
  badges: Badge[];
  points: number;
  streak: number;
  level: number;
  verifications: Verification[];
  certifications: Certification[];
  socialLinks: SocialLinks;
  preferences: UserPreferences;
  stats: UserStats;
  lastActive: string;
  isOnline: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  description?: string;
  yearsOfExperience?: number;
  certifications?: string[];
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;
  timezone: string;
  recurring: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: Skill;
  skillWanted: Skill;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'review' | 'admin_announcement';
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