import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState, UserProfile, Reward } from '../../types';
import { useAppState, getPublicProfile } from '../../services/storageService';
import { BADGES } from '../../constants';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const BadgeGallery: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId?: string }>();
    const { state, loading: appLoading } = useAppState();

    const [viewUser, setViewUser] = useState<UserProfile | null>(null);
    const [viewRewards, setViewRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!userId || userId === state.user.id) {
                if (!appLoading) {
                    setViewUser(state.user);
                    setViewRewards(state.rewards);
                    setLoading(false);
                }
            } else {
                setLoading(true);
                const u = await getPublicProfile(userId);
                if (u) {
                    setViewUser(u);
                    // Public profiles don't expose full rewards list yet.
                    // We'll rely on the gem-threshold fallback defined in isOwned.
                    setViewRewards([]);
                }
                setLoading(false);
            }
        };
        load();
    }, [userId, appLoading, state.user, state.rewards]);

    if (loading || appLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff] text-brand-purple font-bold">Loading...</div>;
    if (!viewUser) return <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff] text-brand-purple font-bold">User not found</div>;

    const currentGems = viewUser.gems || 0;

    // Check ownership for "Earned" status (once earned, always earned)
    const isOwned = (badgeId: string) => viewRewards.some(r => r.id === badgeId && r.purchased) || currentGems >= (BADGES.find(b => b.id === badgeId)?.threshold || 0);

    // Calculate progress to next badge based on CURRENT gems
    // Find first badge where threshold > currentGems
    const nextBadge = BADGES.find(b => b.threshold > currentGems);

    // Find highest badge where threshold <= currentGems OR owned
    // Logic: Current Rank is based on holding? Or highest owned?
    // User implies "wealth" -> usually holding.
    // Let's assume Rank is based on highest OWNED badge.
    const currentBadge = [...BADGES].reverse().find(b => isOwned(b.id));

    // For progress bar: 
    let progressPercent = 0;
    let progressText = '';

    if (!nextBadge) {
        progressPercent = 100;
        progressText = 'Max Level Reached!';
    } else {
        const prevThreshold = BADGES.find(b => b.threshold < nextBadge.threshold && b.threshold <= currentGems)?.threshold || 0;
        // Calculation: (currentGems - prevThreshold) / (nextBadge.threshold - prevThreshold)
        // If currentGems < prevThreshold (spent below previous tier), progress might be negative? 
        // No, we should floor prevThreshold at 0 relative comparison or just handle straight percentage of current gap?
        // User example: 50 gems. Next is 200. Prev was 100 (owned). 
        // 50 < 100.
        // User needs 150 more.
        // Progress should probably show raw gems vs target? 
        // Or if I dropped below, maybe progress is just currentGems / nextThreshold? 
        // If I have 50, target is 200. I am 25% there. 
        // Simpler logic: Progress = currentGems / nextBadge.threshold
        // Because "150 more" implies linear scale from 0 to 200.

        progressPercent = Math.min(100, Math.max(0, (currentGems / nextBadge.threshold) * 100));
        progressText = `${nextBadge.threshold - currentGems} more 💎 to next badge`;
    }

    const earnedBadges = BADGES.filter(b => isOwned(b.id));

    // Get recently earned (last 3)
    const recentlyEarned = [...earnedBadges].reverse().slice(0, 3);

    return (
        <div className="min-h-screen bg-[#f3e8ff] pb-24 relative font-body">
            {/* Header */}
            <div className="p-6 pt-12 flex items-center gap-4 relative z-10">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1 text-center pr-10">
                    <h1 className="font-display font-bold text-gray-900 text-2xl tracking-tight">Badge Gallery</h1>
                </div>
            </div>

            <div className="px-6 space-y-8">
                {/* Main Featured Badge (Highest Earned) */}
                <div className="flex flex-col items-center justify-center py-6">
                    {currentBadge ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-glow border-4 border-white overflow-hidden p-2">
                                <img src={currentBadge.image} className="w-full h-full object-contain" alt={currentBadge.title} />
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-gray-800">{currentBadge.title}</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Current Rank</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center text-gray-500">Keep saving gems to unlock your first badge!</div>
                    )}
                </div>

                {/* Recently Earned */}
                {recentlyEarned.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recently Earned</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {recentlyEarned.map(badge => (
                                <div key={badge.id} className="min-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 overflow-hidden p-1">
                                        <img src={badge.image} className="w-full h-full object-contain" alt={badge.title} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{badge.title}</h4>
                                        <p className="text-[10px] text-gray-400">Unlocked!</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Badges Grid */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All Badges</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {BADGES.map((badge) => {
                            const isUnlocked = isOwned(badge.id); // Or check gems threshold directly 
                            const nextTarget = badge.threshold;

                            return (
                                <div key={badge.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${isUnlocked ? 'border-brand-purple/20' : 'border-gray-100 opacity-60'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isUnlocked ? 'bg-brand-purple text-white shadow-glow p-1' : 'bg-gray-100 text-gray-400'}`}>
                                        {isUnlocked ? <img src={badge.image} className="w-full h-full object-contain" alt={badge.title} /> : <Lock size={20} />}
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{badge.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium mb-2">{badge.subtitle}</p>

                                    {!isUnlocked && (
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-purple"
                                                style={{ width: `${Math.min(100, (currentGems / badge.threshold) * 100)}%` }} // Linear progress to threshold
                                            />
                                        </div>
                                    )}
                                    <p className="text-[10px] text-brand-purple font-bold mt-2">
                                        {!isUnlocked
                                            ? `${Math.max(0, badge.threshold - currentGems)} more 💎`
                                            : `${badge.threshold} 💎`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Your Progress */}
                <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center gap-6">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        {/* Circular Progress Placeholder - implementing simple SVG */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#f3e8ff" strokeWidth="8" fill="none" />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#a855f7"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 36}`}
                                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercent / 100)}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-brand-purple">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{earnedBadges.length} / {BADGES.length} Badges</h3>
                        <p className="text-xs text-gray-500 font-bold">{progressText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
