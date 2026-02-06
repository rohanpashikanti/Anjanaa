import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { INITIAL_TASKS, INITIAL_REWARDS } from '../constants';

const USERS_COLLECTION = 'users'; // New collection for multi-user
const SESSION_KEY = 'nexo_user_id';

export const AuthService = {
    // Login with username and pin
    login: async (username: string, pin: string): Promise<UserProfile | null> => {
        if (!db) {
            throw new Error("Database not initialized. Please ensure Firebase environment variables are set in Vercel.");
        }
        try {
            const q = query(
                collection(db, USERS_COLLECTION),
                where('username', '==', username),
                where('pin', '==', pin)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = { id: userDoc.id, ...userDoc.data() } as UserProfile;

            // Persist session
            localStorage.setItem(SESSION_KEY, userData.id);
            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    // Logout - clear session
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        // Ideally we would trigger a state update via an event or callback
        window.location.reload(); // Simple force-refresh to clear state for now
    },

    // Get current session user ID
    getSessionUserId: (): string | null => {
        return localStorage.getItem(SESSION_KEY);
    },

    // Retrieve full user profile from session ID
    getCurrentUser: async (): Promise<UserProfile | null> => {
        const userId = localStorage.getItem(SESSION_KEY);
        if (!userId || !db) return null;

        try {
            const docRef = doc(db, USERS_COLLECTION, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as UserProfile;
            } else {
                localStorage.removeItem(SESSION_KEY); // Invalid session
                return null;
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    },

    // Register a new user (for Admin / Initial Setup)
    register: async (
        username: string,
        pin: string,
        role: 'guardian' | 'child' = 'child',
        profileData: Partial<UserProfile> = {}
    ): Promise<UserProfile> => {
        if (!db) {
            throw new Error("Database not initialized. Check Firebase configuration.");
        }
        // Check if username exists
        const q = query(collection(db, USERS_COLLECTION), where('username', '==', username));
        const exists = await getDocs(q);
        if (!exists.empty) {
            throw new Error("Username already taken");
        }

        const newUser: Omit<UserProfile, 'id'> = {
            username,
            pin,
            role,
            name: profileData.name || username,
            age: profileData.age || 0,
            gender: profileData.gender || 'boy',
            avatarId: profileData.avatarId || 'boy1',
            gems: 0,
            lifetimeGems: 0,
            xp: 0,
            level: 1,
            isSetupComplete: !!profileData.isSetupComplete,
            streak: 0,
            gemsThisWeek: 0,
            questsCompleted: 0,
            sleepMode: false,
            friends: [],
            friendRequests: [],
            ...profileData
        };

        const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser);
        const createdUser = { id: docRef.id, ...newUser } as UserProfile;

        // Seed Data: Create sub-collections or linked collections for Tasks/Rewards
        // Here we will use top-level collections with userId for better querying

        // Seed Tasks
        // Note: We need to import seed function or do it here. 
        // For now simple inline logic or we let storageService handle lazy init. 
        // Let's seed initial tasks here for robustness.

        // Seed logic deferred to StorageService or a helper to keep Auth clean? 
        // Actually, creating the user document is enough for Auth. 
        // We can initialize data on first load in StorageService.

        localStorage.setItem(SESSION_KEY, createdUser.id);
        return createdUser;
    }
};
