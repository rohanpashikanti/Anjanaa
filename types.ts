export type Role = 'explorer' | 'guardian' | null;

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromName: string; // Helpful for UI
  fromAvatarId: string; // Helpful for UI
  toUserId: string;
  status: 'pending' | 'accepted' | 'ignored';
  createdAt: string;
}

export interface UserProfile {
  id: string; // Unique Firestore ID
  username: string; // Unique login name
  name: string;
  age: number;
  gender: 'boy' | 'girl';
  avatarId: string;
  gems: number;
  lifetimeGems: number; // For badges based on total earnings
  pin: string;
  role: 'guardian' | 'child'; // Explicit role
  isSetupComplete: boolean;
  lastLoginDate?: string;
  streak: number;
  gemsThisWeek: number;
  questsCompleted: number;
  sleepMode: boolean;
  xp: number;
  level: number;

  // Profile & Social
  motto?: string;
  friends: string[]; // List of User IDs
  friendRequests: FriendRequest[];
  bestStreak?: number; // Tracking best streak for UI
  lastCheckInDate?: string; // YYYY-MM-DD
}

export type TaskCategory = 'Homework' | 'Chores' | 'Physical' | 'Creative' | 'Quiet Time' | 'Daily Habit' | 'Brain Power' | 'Zen Mode';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  reward: number;
  xp?: number;
  status: 'pending' | 'completed' | 'approved';
  isRecurring: boolean;
  createdAt: number;
  image?: string; // For visual tasks
  userId: string;
}

export interface Reward {
  id: string;
  title: string;
  subtitle?: string; // e.g., "Gold Tier"
  cost: number;
  image: string; // Emoji or URL
  type: 'badge' | 'voucher' | 'item';
  purchased: boolean;
  purchasedAt?: string; // ISO Date string
  isLocked?: boolean;
}

export interface GemTransaction {
  id: string;
  userId: string;
  type: 'task' | 'streak' | 'bonus' | 'reward';
  amount: number; // positive for addition, negative for subtraction
  title: string;
  category?: string; // e.g., 'Daily Task', 'Challenge'
  createdAt: string; // ISO string
  icon?: string; // Emoji
}

export interface AppState {
  user: UserProfile;
  tasks: Task[];
  rewards: Reward[];
  transactions: GemTransaction[];
}
