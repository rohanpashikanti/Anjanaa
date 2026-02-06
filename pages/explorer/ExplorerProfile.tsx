import React, { useState, useEffect } from 'react';
import { useAppState, updateMotto, searchUserByUsername, sendFriendRequest, respondToFriendRequest, getFriendsList, getPublicProfile } from '../../services/storageService';
import { FriendRequest, UserProfile } from '../../types';
import { BottomDock } from '../../components/BottomDock';
import { Settings, Share2, Flame, Trophy, Lock, User, Plus, Search, ChevronLeft, Gem, Pencil, Check } from 'lucide-react';
import { AVATARS, BADGES } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const FriendCard: React.FC<{ friend: UserProfile, onClick: () => void }> = ({ friend, onClick }) => {
    return (
        <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-brand-light">
                <img
                    src={AVATARS.find(a => a.id === friend.avatarId)?.src || AVATARS[0].src}
                    className="w-full h-full object-cover"
                    alt="Friend"
                />
            </div>
            <span className="text-xs font-bold text-gray-700">{friend.name}</span>
        </div>
    )
}

const FriendRequestCard: React.FC<{ request: FriendRequest, onAccept: () => void, onIgnore: () => void }> = ({ request, onAccept, onIgnore }) => {
    return (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-light overflow-hidden">
                    <img
                        src={AVATARS.find(a => a.id === request.fromAvatarId)?.src || AVATARS[0].src}
                        className="w-full h-full object-cover"
                        alt="Requester"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">{request.fromName}</p>
                    <p className="text-[10px] text-gray-500">wants to qualify!</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onIgnore} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">Ignore</button>
                <button onClick={onAccept} className="px-3 py-1.5 bg-brand-purple text-white rounded-lg text-xs font-bold shadow-brand">Accept</button>
            </div>
        </div>
    )
}

export const ExplorerProfile: React.FC = () => {
    const { state, loading: appLoading } = useAppState();
    const { userId } = useParams<{ userId?: string }>(); // Optional param for viewing others
    const navigate = useNavigate();

    const [viewUser, setViewUser] = useState<UserProfile | null>(null);
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [motto, setMotto] = useState('');
    const [isEditingMotto, setIsEditingMotto] = useState(false);



    const isOwnProfile = !userId || userId === state.user.id;
    const currentUser = state.user;

    // Load Profile Data
    useEffect(() => {
        const load = async () => {
            if (isOwnProfile) {
                if (!appLoading) {
                    setViewUser(state.user);
                    setMotto(state.user.motto || '');
                    if (state.user.friends && state.user.friends.length > 0) {
                        const fList = await getFriendsList(state.user.friends);
                        setFriends(fList);
                    } else {
                        setFriends([]);
                    }
                }
            } else {
                // Load other user
                // Clear previous state to avoid confusion (optional, but good for UX)
                // setFriends([]); 

                if (userId) {
                    const u = await getPublicProfile(userId);
                    setViewUser(u);
                    if (u && u.friends && u.friends.length > 0) {
                        const fList = await getFriendsList(u.friends);
                        setFriends(fList);
                    } else {
                        setFriends([]);
                    }
                }
            }
        };
        load();
    }, [userId, appLoading, state.user, isOwnProfile]);

    // Update motto local state when user changes (if own profile)
    useEffect(() => {
        if (isOwnProfile && state.user.motto !== motto && !isEditingMotto) {
            setMotto(state.user.motto || '');
        }
    }, [state.user.motto]);

    const handleMottoSave = async () => {
        setIsEditingMotto(false);
        if (isOwnProfile) {
            await updateMotto(motto);
        }
    };



    const handleAcceptRequest = async (reqId: string) => {
        await respondToFriendRequest(reqId, true);
    }

    const handleIgnoreRequest = async (reqId: string) => {
        await respondToFriendRequest(reqId, false);
    }

    if (!viewUser) return <div className="min-h-screen bg-[#f3e8ff] flex items-center justify-center text-brand-purple font-bold">Loading...</div>;

    const activeAvatar = AVATARS.find(a => a.id === viewUser.avatarId) || AVATARS[0];

    // Determine Badge Title
    const currentBadge = BADGES.slice().reverse().find(b => (viewUser.gems || 0) >= b.threshold);
    const badgeTitle = currentBadge ? currentBadge.title : "Beginner Bhaskar";

    // Privacy Check
    // If not own profile, checks if friendId exists in user.friends
    const isFriend = state.user.friends?.includes(viewUser.id);
    const isPending = state.user.friendRequests?.some(r => r.toUserId === viewUser.id && r.status === 'pending') ||
        viewUser.friendRequests?.some(r => r.fromUserId === state.user.id && r.status === 'pending'); // check both sides just in case sync is weird, but mostly outgoing from us

    const canViewProfile = isOwnProfile || isFriend;

    const handleSendRequest = async () => {
        const res = await sendFriendRequest(viewUser.id);
        if (res.success) {
            alert("Friend request sent!");
            // In a real app, we'd update local state or wait for stream to update
        } else {
            alert(res.message);
        }
    };

    if (!canViewProfile) {
        return (
            <div className="min-h-screen bg-[#f3e8ff] pb-28 font-body overflow-x-hidden">
                {/* Header Background */}
                <div className="bg-gradient-to-b from-brand-light to-[#f3e8ff] pb-10 rounded-b-[3rem] relative">
                    <div className="p-6 pt-12 flex justify-between items-center">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-bold text-gray-700">
                            Back
                        </button>
                    </div>

                    {/* Header Info - Private */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white z-10 relative opacity-80 blur-[2px]">
                            <img src={activeAvatar.src} className="w-full h-full object-cover grayscale" alt="Private Profile" />
                        </div>
                        <div className="bg-gray-400 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider -mt-4 z-20 shadow-lg border-2 border-white flex items-center gap-1">
                            <Lock size={10} /> Private Explorer
                        </div>
                    </div>
                </div>

                <div className="px-6 space-y-8 mt-10 text-center">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-800">{viewUser.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">This explorer's profile is private.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col items-center">
                        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-purple mb-4 shadow-inner">
                            <User size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Become Friends?</h3>
                        <p className="text-gray-500 text-xs mb-6 max-w-[200px]">
                            Add {viewUser.name} to your space crew to see their badges, streaks, and more!
                        </p>

                        {isPending ? (
                            <button disabled className="px-8 py-3 bg-gray-200 text-gray-500 rounded-xl font-bold text-sm flex items-center gap-2 cursor-not-allowed">
                                <span className="animate-pulse">⏳</span> Request Pending
                            </button>
                        ) : (
                            <button
                                onClick={handleSendRequest}
                                className="px-8 py-3 bg-brand-purple text-white rounded-xl font-bold text-sm shadow-brand hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> Send Friend Request
                            </button>
                        )}
                    </div>
                </div>

                <BottomDock />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#f3e8ff] pb-28 font-body overflow-x-hidden">
            {/* Header Background */}
            <div className="bg-gradient-to-b from-brand-light to-[#f3e8ff] pb-10 rounded-b-[3rem] relative">
                <div className="p-6 pt-12 flex justify-between items-center">
                    {isOwnProfile ? (
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600">
                            <Settings size={20} />
                        </button>
                    ) : (
                        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-bold text-gray-700">
                            Back
                        </button>
                    )}

                    {isOwnProfile && (
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600">
                            <Share2 size={20} />
                        </button>
                    )}
                </div>

                {/* Header Info */}
                <div className="flex flex-col items-center relative z-10">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white z-10 relative">
                        <img src={activeAvatar.src} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    <div className="bg-brand-purple text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider -mt-4 z-20 shadow-lg border-2 border-white">
                        {badgeTitle}
                    </div>
                </div>

                {/* Daily Motto */}
                <div className="mx-6 mt-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 text-center shadow-sm border border-white/50 relative group">
                        <div className="flex justify-center items-center mb-2">
                            <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Daily Motto</p>
                            {isOwnProfile && (
                                <button
                                    onClick={() => isEditingMotto ? handleMottoSave() : setIsEditingMotto(true)}
                                    className="absolute right-6 top-6 text-brand-purple hover:scale-110 transition-transform p-1"
                                >
                                    {isEditingMotto ? <Check size={20} className="text-green-500" /> : <Pencil size={18} className="text-brand-purple/50" />}
                                </button>
                            )}
                        </div>
                        {isOwnProfile ? (
                            isEditingMotto ? (
                                <textarea
                                    value={motto}
                                    onChange={(e) => setMotto(e.target.value)}
                                    autoFocus
                                    placeholder="What is your goal today?"
                                    className="w-full bg-transparent text-center font-display font-bold text-xl text-gray-800 placeholder-gray-300 resize-none outline-none overflow-hidden border-b-2 border-brand-purple/20 pb-1"
                                    rows={1}
                                />
                            ) : (
                                <h2 onClick={() => setIsEditingMotto(true)} className="font-display font-bold text-xl text-gray-800 cursor-pointer">
                                    "{motto || 'What is your goal today?'}" 🚀
                                </h2>
                            )
                        ) : (
                            <h2 className="font-display font-bold text-xl text-gray-800">"{viewUser.motto || 'Ready for adventure!'}" 🚀</h2>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-8 mt-6">

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-white rounded-3xl p-5 flex flex-col items-center justify-center shadow-soft border border-gray-50 min-h-[140px]">
                        <Gem size={24} className="text-blue-400 mb-2" />
                        <span className="text-4xl font-display font-bold text-gray-900">{viewUser.gems}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Diamonds</span>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl p-5 flex flex-col items-center justify-center shadow-soft border border-gray-50 min-h-[140px]">
                        <Flame size={24} className="text-orange-500 mb-2" />
                        <span className="text-4xl font-display font-bold text-gray-900">{viewUser.streak}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Current Streak</span>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl p-5 flex flex-col items-center justify-center shadow-soft border border-gray-50 min-h-[140px]">
                        <Trophy size={24} className="text-amber-400 mb-2" />
                        <span className="text-4xl font-display font-bold text-gray-900">{viewUser.bestStreak || viewUser.streak}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Best Streak</span>
                    </div>
                </div>

                {/* Achievements - Just a preview grid */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
                        <span onClick={() => navigate(isOwnProfile ? '/badge-gallery' : `/badge-gallery/${viewUser.id}`)} className="text-xs font-bold text-brand-purple cursor-pointer">View All</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                        {/* Badges List */}
                        {BADGES.map(badge => {
                            const isUnlocked = (viewUser.gems || 0) >= badge.threshold;
                            const isEarned = (viewUser.gems || 0) >= badge.threshold; // Could use separate logic if purchased, but badges are automatic

                            return (
                                <div key={badge.id} className={`w-20 h-20 rounded-2xl shadow-sm border flex-shrink-0 flex items-center justify-center relative overflow-hidden ${isUnlocked ? 'bg-white border-brand-purple' : 'bg-gray-50 border-gray-100'}`}>
                                    {isUnlocked ? (
                                        <img src={badge.image} className="w-16 h-16 object-contain" alt={badge.title} />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Lock size={20} className="text-gray-300 mb-1" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Space Friends */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Space Friends</h2>
                        {isOwnProfile && (
                            <button onClick={() => navigate('/explorer/friends/find')} className="text-xs font-bold text-brand-purple cursor-pointer flex items-center gap-1">
                                <Plus size={14} /> Find Friends
                            </button>
                        )}
                    </div>

                    {/* Inbox for Friend Requests (Own profile only) */}
                    {isOwnProfile && currentUser.friendRequests && currentUser.friendRequests.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Friend Requests</p>
                            {currentUser.friendRequests.map(req => (
                                <FriendRequestCard
                                    key={req.id}
                                    request={req}
                                    onAccept={() => handleAcceptRequest(req.id)}
                                    onIgnore={() => handleIgnoreRequest(req.id)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar items-start">
                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/explorer/friends/find')}
                                className="flex flex-col items-center gap-2 flex-shrink-0 group"
                            >
                                <div className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-brand active:scale-95 transition-transform group-hover:bg-brand-dark">
                                    <Search size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-700">Find</span>
                            </button>
                        )}

                        {friends.map(friend => (
                            <FriendCard key={friend.id} friend={friend} onClick={() => navigate(`/explorer/profile/${friend.id}`)} />
                        ))}

                        {friends.length === 0 && !isOwnProfile && (
                            <p className="text-sm text-gray-400 italic">No friends yet.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Search Modal */}


            <BottomDock />
        </div>
    );
};
