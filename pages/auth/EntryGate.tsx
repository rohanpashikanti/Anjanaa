import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../services/storageService';
import { AuthService } from '../../services/authService';
import { LayoutGrid, Bell, ArrowRight, Shield, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { AVATARS } from '../../constants';

export const EntryGate: React.FC = () => {
    const navigate = useNavigate();
    const { state, loading } = useAppState();
    const { user } = state;

    useEffect(() => {
        // 1. Check Session First
        const sessionId = AuthService.getSessionUserId();
        if (!sessionId) {
            navigate('/login');
            return;
        }

        // 2. If session exists but state loading, wait
        if (loading) return;

        // 3. User setup check
        // If not setup complete, force setup flow unless it's a guardian role who might skip it?
        // Actually, let's keep it simple: if not setup complete, go to setup.
        if (!user.isSetupComplete) {
            navigate('/setup/guardian');
        }
    }, [loading, navigate, user.isSetupComplete]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-lilac-50 text-brand-purple font-bold">Loading Adventure...</div>;

    const userAvatar = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] to-[#e0e7ff] p-6 flex flex-col relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center z-10">
                <img src="/logo.png" alt="Anjanaa" className="w-10 h-10 object-contain drop-shadow-sm" />
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star size={10} fill="white" className="text-white" />
                    </div>
                    <span className="font-bold text-xs font-display text-gray-700 tracking-wide">FREE MODE</span>
                </div>
                <button onClick={() => { AuthService.logout(); }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-600 hover:text-red-500">
                    <Lock size={20} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 -mt-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-48 h-48 mb-6 relative"
                >
                    {/* User Avatar */}
                    <img
                        src={userAvatar.src}
                        alt="Hello"
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg text-2xl">👋</div>
                </motion.div>

                <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Hello, <span className="text-brand-purple">{user.name || 'Explorer'}!</span></h1>
                <p className="text-gray-500 text-center max-w-xs mb-10">Ready to start your adventure today?</p>

                <div className="w-full max-w-sm space-y-4">
                    {/* Child Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/explorer/dashboard')}
                        className="bg-white rounded-[2rem] p-4 flex items-center justify-between shadow-soft border border-white/50 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
                                🚀
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg text-gray-800">Child</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Level {user.level} Scout</span>
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                            <ArrowRight size={20} />
                        </div>
                    </motion.div>

                    {/* Parent Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/auth/pin')}
                        className="bg-white/60 rounded-[2rem] p-4 flex items-center justify-between shadow-sm border border-white/50 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-inner">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg text-gray-800">Parent</h3>
                                <p className="text-xs text-gray-500">Dashboard & Settings</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Lock size={18} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
