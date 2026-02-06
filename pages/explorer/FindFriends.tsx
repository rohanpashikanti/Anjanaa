import React, { useState, useEffect } from 'react';
import { useAppState, searchUserByUsername, sendFriendRequest, respondToFriendRequest, getFriendsList } from '../../services/storageService';
import { UserProfile } from '../../types';
import { BottomDock } from '../../components/BottomDock';
import { Search, ChevronLeft, UserPlus, Check, X, Star, User } from 'lucide-react';
import { AVATARS } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PendingRequestCard: React.FC<{ request: any, onAccept: () => void, onIgnore: () => void }> = ({ request, onAccept, onIgnore }) => {
    return (
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 mb-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-light border-2 border-white shadow-sm">
                    <img
                        src={AVATARS.find(a => a.id === request.fromAvatarId)?.src || AVATARS[0].src}
                        className="w-full h-full object-cover"
                        alt="Requester"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{request.fromName}</h3>
                    <p className="text-xs font-bold text-brand-purple">@{request.fromUsername}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onAccept}
                    className="flex-1 py-3 bg-green-400 text-white rounded-xl font-bold font-display shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <Check size={18} /> Accept
                </button>
                <button
                    onClick={onIgnore}
                    className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold font-display active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <X size={18} /> Ignore
                </button>
            </div>
        </div>
    )
}

const AddedFriendCard: React.FC<{ friend: UserProfile, onVisit: () => void }> = ({ friend, onVisit }) => {
    return (
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-light border-2 border-white shadow-sm">
                    <img
                        src={AVATARS.find(a => a.id === friend.avatarId)?.src || AVATARS[0].src}
                        className="w-full h-full object-cover"
                        alt="Friend"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-base">{friend.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400">Level {friend.level}</p>
                </div>
            </div>
            <button
                onClick={onVisit}
                className="px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-xl font-bold text-xs active:scale-95 transition-transform flex items-center gap-2"
            >
                <User size={16} /> Visit
            </button>
        </div>
    )
}

export const FindFriends: React.FC = () => {
    const { state, loading } = useAppState();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not-found' | 'sent'>('idle');
    const [searchResult, setSearchResult] = useState<UserProfile | null>(null);
    const [friends, setFriends] = useState<UserProfile[]>([]);

    const currentUser = state.user;

    useEffect(() => {
        const loadFriends = async () => {
            if (currentUser.friends && currentUser.friends.length > 0) {
                const list = await getFriendsList(currentUser.friends);
                setFriends(list);
            } else {
                setFriends([]); // Reset if no friends
            }
        };
        loadFriends();
    }, [currentUser.friends]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchStatus('searching');
        setSearchResult(null);

        // Simulate network delay for effect
        setTimeout(async () => {
            const res = await searchUserByUsername(searchQuery);
            if (res) {
                if (res.id === currentUser.id) {
                    setSearchResult(null);
                    setSearchStatus('not-found'); // Can't friend yourself
                    return;
                }
                setSearchResult(res);
                setSearchStatus('found');
            } else {
                setSearchStatus('not-found');
            }
        }, 600);
    };

    const handleSendRequest = async () => {
        if (searchResult) {
            try {
                const res = await sendFriendRequest(searchResult.id);
                if (res.success) {
                    setSearchStatus('sent');
                    setTimeout(() => {
                        setSearchQuery('');
                        setSearchStatus('idle');
                        setSearchResult(null);
                    }, 2000);
                } else {
                    alert(res.message);
                }
            } catch (error) {
                console.error("Error sending friend request:", error);
                alert("Failed to send request. Please try again.");
            }
        }
    };

    const handleAccept = async (reqId: string) => {
        await respondToFriendRequest(reqId, true);
        // Refresh friends will happen automatically via useAppState user update
    }

    const handleIgnore = async (reqId: string) => {
        await respondToFriendRequest(reqId, false);
    }

    return (
        <div className="min-h-screen bg-[#f3e8ff] pb-28 font-body overflow-x-hidden">
            {/* Header */}
            <div className="p-6 pt-12 flex items-center gap-4">
                <button
                    onClick={() => navigate('/explorer/profile')}
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-purple active:scale-95 transition-transform"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-display font-bold text-gray-900">Find Friends</h1>
            </div>

            <div className="px-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-purple/50" size={24} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search username..."
                        className="w-full bg-white rounded-[2rem] py-5 pl-14 pr-5 font-bold text-lg text-gray-800 placeholder-brand-purple/30 shadow-sm border-2 border-transparent focus:border-brand-purple/20 outline-none transition-all"
                    />
                </form>

                {/* Search Results Area */}
                <div className="mb-10">
                    <h2 className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 pl-2">Search Results</h2>

                    <AnimatePresence mode="wait">
                        {searchStatus === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center py-10 opacity-50"
                            >
                                <div className="w-20 h-20 bg-white/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Search size={32} className="text-brand-purple" />
                                </div>
                                <p className="font-bold text-brand-purple">Enter a username to search</p>
                            </motion.div>
                        )}

                        {searchStatus === 'searching' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="bg-white rounded-[2.5rem] p-8 text-center shadow-soft"
                            >
                                <div className="w-16 h-16 border-4 border-brand-light border-t-brand-purple rounded-full animate-spin mx-auto mb-4" />
                                <p className="font-bold text-gray-500">Scanning space...</p>
                            </motion.div>
                        )}

                        {searchStatus === 'not-found' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[2.5rem] p-8 text-center shadow-soft"
                            >
                                <div className="text-4xl mb-2">🔭</div>
                                <h3 className="font-bold text-xl text-gray-800 mb-1">Explorer Not Found</h3>
                                <p className="text-gray-400 text-sm">Check the spelling and try again!</p>
                            </motion.div>
                        )}

                        {searchStatus === 'found' && searchResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-[2.5rem] p-8 text-center shadow-soft relative overflow-hidden"
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-light/30 to-transparent" />

                                <div className="relative z-10">
                                    <div className="w-24 h-24 rounded-full mx-auto mb-4 p-1 bg-white shadow-sm relative">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                                            <img
                                                src={AVATARS.find(a => a.id === searchResult.avatarId)?.src || AVATARS[0].src}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1.5 rounded-full border-4 border-white text-white">
                                            <Star size={12} fill="currentColor" />
                                        </div>
                                    </div>

                                    <h3 className="font-display font-bold text-2xl text-gray-900 mb-1">{searchResult.name}</h3>
                                    <p className="text-sm font-bold text-gray-400 mb-6">Level {searchResult.level} • Space Ranger</p>

                                    <button
                                        onClick={handleSendRequest}
                                        className="w-full py-4 bg-brand-purple text-white rounded-2xl font-bold font-display shadow-brand active:scale-95 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <UserPlus size={20} /> Send Friend Request
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {searchStatus === 'sent' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[2.5rem] p-8 text-center shadow-soft"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Check size={40} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-800 mb-1">Request Sent!</h3>
                                <p className="text-gray-400 text-sm">Waiting for them to accept.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pending Requests */}
                {currentUser.friendRequests && currentUser.friendRequests.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 pl-2">
                            <h2 className="text-xs font-bold text-brand-purple uppercase tracking-wider">Pending Requests</h2>
                            <span className="bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {currentUser.friendRequests.length} New
                            </span>
                        </div>

                        {currentUser.friendRequests.map(req => (
                            <PendingRequestCard
                                key={req.id}
                                request={req}
                                onAccept={() => handleAccept(req.id)}
                                onIgnore={() => handleIgnore(req.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Added Friends List */}
                <div>
                    <h2 className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 pl-2">Your Space Friends</h2>
                    {friends.length > 0 ? (
                        <div className="space-y-2">
                            {friends.map(friend => (
                                <AddedFriendCard
                                    key={friend.id}
                                    friend={friend}
                                    onVisit={() => navigate(`/explorer/profile/${friend.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400 italic text-sm">
                            <p>No space friends yet. Search to add some!</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomDock />
        </div>
    );
};
