import { useState, useEffect } from 'react';
import { AppState, UserProfile, Task, Reward, FriendRequest, GemTransaction } from '../types';
import { INITIAL_TASKS, INITIAL_REWARDS, BADGES } from '../constants';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc, updateDoc, collection, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { AuthService } from './authService';

// Default / Guest State
const defaultState: AppState = {
  user: {
    id: 'guest',
    username: 'guest',
    role: 'child',
    name: 'Guest',
    age: 0,
    gender: 'boy',
    avatarId: 'boy1',
    gems: 0,
    lifetimeGems: 0,
    xp: 0,
    level: 1,
    pin: '',
    isSetupComplete: false,
    streak: 0,
    gemsThisWeek: 0,
    questsCompleted: 0,
    sleepMode: false,
    friends: [],
    friendRequests: [],
    motto: '',
    bestStreak: 0,
  },
  tasks: [],
  rewards: [],
  transactions: [],
};

// --- Hook for Real-time Data (Multi-User) ---
export const useAppState = () => {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = AuthService.getSessionUserId();

    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Track loading of 3 streams
    let userLoaded = false;
    let tasksLoaded = false;
    let rewardsLoaded = false;

    // Initial state with empty arrays to prevent mapping errors before load
    setState(prev => ({ ...prev, tasks: [], rewards: [] }));

    const checkLoading = () => {
      // We consider it loaded enough when user profile is loaded. 
      // Tasks/Rewards can stream in.
      if (userLoaded) {
        setLoading(false);
      }
    };

    // 1. User Profile Listener
    const userRef = doc(db, 'users', userId);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const userData = snap.data();
        setState(prev => ({
          ...prev,
          user: {
            id: snap.id,
            ...userData,
            // Ensure all required fields exist (schema migration safety)
            username: userData.username || '',
            role: userData.role || 'child',
            name: userData.name || '',
            age: userData.age || 0,
            gender: userData.gender || 'boy',
            avatarId: userData.avatarId || 'boy1',
            gems: userData.gems || 0,
            lifetimeGems: userData.lifetimeGems || 0,
            xp: userData.xp || 0,
            level: userData.level || 1,
            pin: userData.pin || '',
            isSetupComplete: userData.isSetupComplete || false,
            streak: userData.streak || 0,
            gemsThisWeek: userData.gemsThisWeek || 0,
            questsCompleted: userData.questsCompleted || 0,

            sleepMode: userData.sleepMode || false,
            friends: userData.friends || [],
            friendRequests: userData.friendRequests || [],
            motto: userData.motto || '',
            bestStreak: userData.bestStreak || 0,
            lastCheckInDate: userData.lastCheckInDate || ''
          }
        }));
      }
      userLoaded = true;
      checkLoading();
    }, (error) => {
      console.error("Error listening to user:", error);
      setLoading(false);
    });

    // 2. Tasks Listener
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const unsubTasks = onSnapshot(tasksQuery, (snap) => {
      const tasks: Task[] = [];
      snap.forEach(doc => tasks.push({ id: doc.id, ...doc.data() } as Task));
      setState(prev => ({ ...prev, tasks }));
      tasksLoaded = true;
      checkLoading();
    });

    // 3. Rewards Listener
    const rewardsQuery = query(collection(db, 'rewards'), where('userId', '==', userId));
    const unsubRewards = onSnapshot(rewardsQuery, (snap) => {
      const rewards: Reward[] = [];
      snap.forEach(doc => rewards.push({ id: doc.id, ...doc.data() } as Reward));
      setState(prev => ({ ...prev, rewards }));
      rewardsLoaded = true;
      checkLoading();
    });

    // 4. Transactions Listener
    const txQuery = query(collection(db, 'transactions'), where('userId', '==', userId));
    const unsubTx = onSnapshot(txQuery, (snap) => {
      const transactions: GemTransaction[] = [];
      snap.forEach(doc => transactions.push({ id: doc.id, ...doc.data() } as GemTransaction));
      setState(prev => ({ ...prev, transactions }));
    });

    return () => {
      unsubUser();
      unsubTasks();
      unsubRewards();
      unsubTx();
    };
  }, []);

  return { state, loading };
};

// --- Actions (User Aware) ---

// Helper to get current user ID
const getCurrentUserId = () => {
  const uid = AuthService.getSessionUserId();
  if (!uid) throw new Error("No active session");
  return uid;
};

// Update User Profile
export const updateProfile = async (updates: Partial<UserProfile>) => {
  const userId = getCurrentUserId();
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};

// Helpers
export const calculateLevel = (xp: number) => {
  if (xp >= 1000) return 5;
  if (xp >= 750) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
};

export const getAppState = () => defaultState; // Deprecated placeholder

// --- Task Actions ---

export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { status });
};

export const addTask = async (task: Task) => {
  const userId = getCurrentUserId();
  const { id, ...taskData } = task; // Let Firestore gen ID usually, but sticking to provided ID if needed?
  // Recommendation: Ignore passed ID and let Firestore generate
  await addDoc(collection(db, 'tasks'), { ...taskData, userId });
};

export const deleteTask = async (taskId: string) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

// --- Reward Actions ---

export const addReward = async (reward: Reward) => {
  const userId = getCurrentUserId();
  const { id, ...rewardData } = reward;
  await addDoc(collection(db, 'rewards'), { ...rewardData, userId });
};

export const deleteReward = async (rewardId: string) => {
  await deleteDoc(doc(db, 'rewards', rewardId));
};

export const recordTransaction = async (data: Omit<GemTransaction, 'id' | 'userId' | 'createdAt'>) => {
  const userId = getCurrentUserId();
  const txData = {
    ...data,
    userId,
    createdAt: new Date().toISOString()
  };
  await addDoc(collection(db, 'transactions'), txData);
};

export const purchaseReward = async (rewardId: string) => {
  const userId = getCurrentUserId();

  // We need to fetch User and Reward transactional-like
  const userRef = doc(db, 'users', userId);
  const rewardRef = doc(db, 'rewards', rewardId);

  const userSnap = await getDoc(userRef);
  const rewardSnap = await getDoc(rewardRef);

  if (!userSnap.exists() || !rewardSnap.exists()) return false;

  const user = userSnap.data() as UserProfile;
  const reward = rewardSnap.data() as Reward;

  if (user.gems >= reward.cost && !reward.isLocked) {
    // Decrement Gems
    await updateDoc(userRef, { gems: user.gems - reward.cost });

    // Mark Purchased
    await updateDoc(rewardRef, {
      purchased: true,
      purchasedAt: new Date().toISOString()
    });

    // Record Transaction
    await recordTransaction({
      type: 'reward',
      amount: -reward.cost,
      title: reward.title,
      icon: reward.type === 'badge' ? '🎖' : '🎁'
    });

    return true;
  }
  return false;
};


// --- Complex Business Logic (Approvals, etc) ---

export const checkBadges = async (userId: string) => {
  // Fetch latest state for logic
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  const rewardsQuery = query(collection(db, 'rewards'), where('userId', '==', userId));
  const rewardsSnap = await getDocs(rewardsQuery);
  const existingBadgeIds = new Set<string>();
  rewardsSnap.forEach(r => {
    const data = r.data();
    if (data.type === 'badge') existingBadgeIds.add(data.id);
  });

  for (const badge of BADGES) {
    if (user.gems >= badge.threshold) {
      if (!existingBadgeIds.has(badge.id)) {
        const newBadge = {
          id: badge.id, // Storing ID in data mainly for reference
          title: badge.title,
          cost: 0,
          image: badge.image,
          type: 'badge',
          purchased: true,
          userId
        };
        await addDoc(collection(db, 'rewards'), newBadge);
      }
    }
  }
};

export const approveTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) return;

  const task = taskSnap.data() as Task;
  const userId = task.userId; // Must store userId on task! -> we do in addTask

  if (task.status !== 'completed') return;

  // Logic: Recurring -> Pending, One-time -> Deleted
  if (task.isRecurring) {
    await updateDoc(taskRef, { status: 'pending' });
  } else {
    await deleteDoc(taskRef);
  }

  // Give Rewards
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  const newGems = user.gems + task.reward;
  const newLifetime = (user.lifetimeGems || 0) + task.reward;
  const newXp = (user.xp || 0) + (task.xp || 10);
  const newLevel = calculateLevel(newXp);
  const newWeek = (user.gemsThisWeek || 0) + task.reward;
  const newQuests = (user.questsCompleted || 0) + 1;

  await updateDoc(userRef, {
    gems: newGems,
    lifetimeGems: newLifetime,
    xp: newXp,
    level: newLevel,
    gemsThisWeek: newWeek,
    questsCompleted: newQuests
  });

  // Record Transaction
  await recordTransaction({
    type: 'task',
    amount: task.reward,
    title: task.title,
    category: 'Daily Task',
    icon: '📝'
  });

  await checkBadges(userId);
};

export const rejectTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { status: 'pending' });
};



export const adjustGems = async (amount: number, reason?: string) => {
  const userId = getCurrentUserId();
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  let newGems = Math.max(0, user.gems + amount);
  let newLifetime = user.lifetimeGems || 0;
  let newWeek = user.gemsThisWeek || 0;

  if (amount > 0) {
    newLifetime += amount;
    newWeek += amount;
  }

  await updateDoc(userRef, {
    gems: newGems,
    lifetimeGems: newLifetime,
    gemsThisWeek: newWeek
  });

  // Record Transaction
  const defaultTitle = amount > 0 ? 'Gem Bonus' : 'Gem Adjustment';
  await recordTransaction({
    type: 'bonus',
    amount: amount,
    title: reason || defaultTitle,
    icon: '💎'
  });

  await checkBadges(userId);
};


// Check Daily Logic (called on load generally)
export const checkDailyLogic = async () => {
  const userId = AuthService.getSessionUserId();
  if (!userId) return;

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  const today = new Date().toISOString().split('T')[0];
  if (user.lastLoginDate !== today) {
    // Reset recurring tasks
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId), where('isRecurring', '==', true));
    const tasksSnap = await getDocs(tasksQuery);
    tasksSnap.forEach(async (tDoc) => {
      await updateDoc(tDoc.ref, { status: 'pending' });
    });

    // Streak Logic
    if (user.lastLoginDate) {
      const lastDate = new Date(user.lastLoginDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) { // If it's more than 1 day since last login, reset streak
        await updateDoc(userRef, { streak: 0 });
      }
    }

    await updateDoc(userRef, { lastLoginDate: today });
  }
};

export const markAttendance = async () => {
  const userId = getCurrentUserId();
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  const today = new Date().toISOString().split('T')[0];
  if (user.lastCheckInDate === today) return; // Prevent double check-in

  const newStreak = user.streak + 1;
  let rewardAmount = 1;
  if (newStreak % 7 === 0) rewardAmount = 10;

  const newGems = user.gems + rewardAmount;
  const newLifetime = (user.lifetimeGems || 0) + rewardAmount;

  await updateDoc(userRef, {
    streak: newStreak,
    gems: newGems,
    lifetimeGems: newLifetime,
    lastCheckInDate: today
  });

  // Record Transaction
  await recordTransaction({
    type: 'streak',
    amount: rewardAmount,
    title: `${newStreak}-Day Streak`,
    category: 'Bonus',
    icon: '✨'
  });

  await checkBadges(userId);
};

// --- Social & Profile Actions ---

export const updateMotto = async (motto: string) => {
  const userId = getCurrentUserId();
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { motto });
};

export const searchUserByUsername = async (username: string): Promise<UserProfile | null> => {
  // Simple exact match for now. In real app, maybe use Algolia or a specific lowercase field.
  // Assuming 'username' field is indexed and unique.
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const snap = await getDocs(q);

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as UserProfile;
};

export const sendFriendRequest = async (toUserId: string) => {
  const currentUserId = getCurrentUserId();
  // Get current user details for the request
  const currentUserRef = doc(db, 'users', currentUserId);
  const currentUserSnap = await getDoc(currentUserRef);
  if (!currentUserSnap.exists()) throw new Error("Current user not found");
  const currentUser = currentUserSnap.data() as UserProfile;

  // Get target user
  const targetUserRef = doc(db, 'users', toUserId);
  const targetUserSnap = await getDoc(targetUserRef);
  if (!targetUserSnap.exists()) throw new Error("Target user not found");
  const targetUser = targetUserSnap.data() as UserProfile;

  // Check if already friends or requested
  if (targetUser.friends?.includes(currentUserId)) return { success: false, message: "Already friends" };
  if (targetUser.friendRequests?.some(r => r.fromUserId === currentUserId && r.status === 'pending')) {
    return { success: false, message: "Request already sent" };
  }

  const newRequest: FriendRequest = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    fromUserId: currentUserId,
    fromUsername: currentUser.username,
    fromName: currentUser.name,
    fromAvatarId: currentUser.avatarId,
    toUserId: toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updatedRequests = [...(targetUser.friendRequests || []), newRequest];
  await updateDoc(targetUserRef, { friendRequests: updatedRequests });
  return { success: true, message: "Request sent!" };
};

export const respondToFriendRequest = async (requestId: string, accept: boolean) => {
  const currentUserId = getCurrentUserId();
  const userRef = doc(db, 'users', currentUserId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data() as UserProfile;

  const requestIndex = user.friendRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return;

  const request = user.friendRequests[requestIndex];

  if (accept) {
    // Add to both friends lists
    // 1. Current User
    const newFriendsList = [...(user.friends || []), request.fromUserId];
    // Remove request from pending (or mark accepted) - let's remove it to keep array clean or keep history?
    // User requested "get 2 options accept or ignore". Usually we remove from list after action.
    const newRequestsList = user.friendRequests.filter(r => r.id !== requestId);

    await updateDoc(userRef, {
      friends: newFriendsList,
      friendRequests: newRequestsList
    });

    // 2. Sender User
    const senderRef = doc(db, 'users', request.fromUserId);
    const senderSnap = await getDoc(senderRef);
    if (senderSnap.exists()) {
      const sender = senderSnap.data() as UserProfile;
      const senderNewFriends = [...(sender.friends || []), currentUserId];
      await updateDoc(senderRef, { friends: senderNewFriends });
    }

  } else {
    // Ignore - just remove from list
    const newRequestsList = user.friendRequests.filter(r => r.id !== requestId);
    await updateDoc(userRef, { friendRequests: newRequestsList }); // effectively delete
  }
};

export const getPublicProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserProfile;
};

export const getFriendsList = async (friendIds: string[]): Promise<UserProfile[]> => {
  if (!friendIds || friendIds.length === 0) return [];
  // Firestore 'in' query supports up to 10. For now assuming small lists or we simple map.
  // Mapping getDoc is reliable for larger lists without index explosion issues (though parallel reads).
  // Let's use Promise.all
  const friends: UserProfile[] = [];
  await Promise.all(friendIds.map(async (fid) => {
    const fRef = doc(db, 'users', fid);
    const fSnap = await getDoc(fRef);
    if (fSnap.exists()) {
      friends.push({ id: fSnap.id, ...fSnap.data() } as UserProfile);
    }
  }));
  return friends;
};
