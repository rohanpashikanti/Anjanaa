import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { useAppState } from '../../services/storageService';
import { AVATARS } from '../../constants';

export const SetupComplete: React.FC = () => {
  const navigate = useNavigate();
  const { state, loading } = useAppState();
  const { user } = state;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-brand-purple font-bold">Loading...</div>;

  const userAvatar = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-amber-50 flex flex-col items-center justify-center p-6 relative">

      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-xl border border-white/50 flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="Anjanaa" className="w-12 h-12 object-contain drop-shadow-sm mb-1" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-48 h-48 mb-6 relative"
        >
          {/* Selected Avatar */}
          <img
            src={userAvatar.src}
            alt="Robot"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Setup <span className="text-brand-purple">Complete!</span>
        </h1>
        <p className="text-gray-500 mb-8 font-body leading-relaxed">
          Your profile is ready to go. Everything is set for the learning adventure.
        </p>
      </div>

      <div className="fixed bottom-10 left-6 right-6">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-brand-purple text-white py-4 px-6 rounded-full font-bold text-lg shadow-glow flex items-center justify-between group active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm">☺</span>
          </div>
          <span>Hand the tablet to {user.name}</span>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-purple group-hover:translate-x-1 transition-transform">
            <ArrowRight size={18} />
          </div>
        </button>
        <div className="text-center mt-4 flex items-center justify-center gap-1 text-xs font-bold text-gray-400">
          <Lock size={10} /> Parental controls active
        </div>
      </div>
    </div>
  );
};
