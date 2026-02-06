import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClayButton } from '../../components/ClayButton';
import { useAppState } from '../../services/storageService';
import { AVATARS } from '../../constants';

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppState(); // Optimistically check if state is loaded (might be guest/default)

  // If user is actually logged in/loaded, use their avatar, otherwise default
  // Note: getStarted might be shown even if logged in?
  // If defaultState, avatarId is 'boy1'.
  const currentAvatar = AVATARS.find(a => a.id === state.user.avatarId) || AVATARS[0];

  return (
    <div className="min-h-screen bg-lilac-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center"
      >
        <div className="w-64 h-64 mb-4 relative flex items-center justify-center">
          {/* Logo instead of Avatar for Welcome? Or both? User said "branding... in every page". 
               The GetStarted page usually introduces the app. Let's show the Logo.
               But the avatar code is specific to the user. 
               Maybe I should keep the avatar as it's the "character".
               Let's add the logo at the top or replace the text "Nexo Ai" with the logo + text.
            */}
          <img
            src={currentAvatar.src}
            alt="3D Character"
            className="w-full h-full object-cover rounded-full shadow-clay-card border-4 border-white animate-bounce-slow"
          />
        </div>

        <div className="flex flex-col items-center mb-2">
          <img src="/logo.png" alt="Anjanaa Logo" className="h-16 mb-2 object-contain" />
          <h1 className="text-4xl font-display font-bold text-gray-800">
            Welcome to <span className="text-lilac-600">Anjanaa</span>
          </h1>
        </div>

        <p className="text-lg text-gray-600 mb-2 max-w-xs font-body italic">
          "Raising little lives, with love"
        </p>
        <p className="text-sm text-gray-400 mb-10 max-w-xs font-body">
          Your new adventure to building great habits starts here!
        </p>

        <div className="w-full max-w-xs">
          <ClayButton onClick={() => navigate('/setup/guardian')} variant="blue" fullWidth className="shadow-xl py-4 text-xl">
            Start Adventure
          </ClayButton>
        </div>
      </motion.div>
    </div>
  );
};
