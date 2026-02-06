import React from 'react';
import { getAppState } from '../../services/storageService';
import { BottomDock } from '../../components/BottomDock';
import { LayoutGrid, Gem, Check, Lock, Shield, Star, Award, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export const PathPage: React.FC = () => {
  const { user } = getAppState();
  
  // Levels map to badge milestones
  // Level 1: Starter (0)
  // Level 2: Bronze Badge (100)
  // Level 3: Silver Badge (250)
  // Level 4: Gold Badge (750)
  // Level 5: Diamond Badge (1000)
  
  // Note: calculateLevel in storageService logic:
  // xp >= 1000 -> 5
  // xp >= 750 -> 4
  // xp >= 250 -> 3
  // xp >= 100 -> 2
  // else -> 1

  // We will treat "Level" as the visual badge milestone.
  const currentXP = user.xp; 
  // For display purposes, we might call XP "Score" or just show progress relative to badges.

  const renderBadgeNode = (levelIndex: number, requiredScore: number, xPos: string, yPos: string, icon: any, label: string) => {
      const isUnlocked = user.level >= levelIndex;
      const isCompleted = user.level > levelIndex;
      const isCurrent = user.level === levelIndex;

      const Icon = icon;

      return (
        <div className={`absolute ${yPos} ${xPos} flex flex-col items-center z-10`}>
            {/* Stars above badge */}
            <div className="flex gap-0.5 mb-2">
                {[1,2,3].map(i => (
                    <Star key={i} size={8} className={isUnlocked ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}/>
                ))}
            </div>

            <motion.div 
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`w-24 h-24 relative flex items-center justify-center transition-all duration-500
                    ${isUnlocked ? 'scale-100' : 'scale-95 grayscale opacity-80'}
                `}
            >
                {/* Badge Shape Background */}
                <div className={`absolute inset-0 rotate-45 rounded-2xl shadow-lg border-4 
                    ${isCurrent ? 'bg-gradient-to-br from-brand-purple to-indigo-500 border-white ring-4 ring-brand-purple/20' : ''}
                    ${isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-white' : ''}
                    ${!isUnlocked ? 'bg-gray-200 border-gray-100' : ''}
                `}></div>

                {/* Content */}
                <div className="relative z-10 text-white flex flex-col items-center">
                    {!isUnlocked ? (
                         <>
                            <Lock size={24} className="text-gray-400 mb-1" />
                            <span className="text-[10px] font-bold text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">{requiredScore} Pts</span>
                         </>
                    ) : (
                         <>
                            <Icon size={32} className="mb-1 drop-shadow-md" />
                            <span className="text-[10px] font-bold uppercase tracking-wide opacity-90">{label}</span>
                         </>
                    )}
                </div>
                
                {/* Connector Line (Manual logic for now) */}
            </motion.div>
            
            {/* Label below */}
            <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border
                 ${isUnlocked ? 'bg-white text-brand-dark border-brand-light' : 'bg-gray-100 text-gray-400 border-transparent'}
            `}>
                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#f8f6ff] pb-24 relative overflow-hidden font-body">
      {/* Background clouds */}
      <div className="absolute top-20 left-[-50px] w-40 h-24 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute top-60 right-[-40px] w-64 h-40 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
      
      {/* Winding Path SVG Line (Background) */}
      <svg className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
         <path 
            d="M 80 730 Q 150 650 250 600 T 300 450 T 150 300 T 200 100" 
            fill="none" 
            stroke="white" 
            strokeWidth="12" 
            strokeLinecap="round"
            strokeDasharray="20 20"
            className="drop-shadow-sm"
         />
      </svg>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-600">
                 <LayoutGrid size={20} />
             </div>
             <div>
                <h1 className="font-display font-bold text-gray-900 text-lg">Adventure Map</h1>
                <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">WORLD 1: TOY VILLAGE</p>
             </div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-100">
            <Gem size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm text-gray-800">{user.gems}</span>
        </div>
      </div>
      
      {/* Map Content */}
      <div className="relative mt-4 max-w-sm mx-auto h-[750px] w-full">
        
        {/* Level 5 - Diamond (1000) */}
        {renderBadgeNode(5, 1000, "left-1/2 -translate-x-1/2", "top-8", Crown, "Diamond")}

        {/* Level 4 - Gold (750) */}
        {renderBadgeNode(4, 750, "right-8", "top-48", Award, "Gold")}

        {/* Level 3 - Silver (250) */}
        {renderBadgeNode(3, 250, "left-12", "top-[26rem]", Shield, "Silver")}

        {/* Level 2 - Bronze (100) */}
        {renderBadgeNode(2, 100, "right-16", "bottom-48", Shield, "Bronze")}

        {/* Level 1 - Starter (0) */}
        {renderBadgeNode(1, 0, "left-8", "bottom-8", Check, "Start")}

      </div>

      <BottomDock />
    </div>
  );
};
