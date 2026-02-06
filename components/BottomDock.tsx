import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Gift, BarChart2, Flower, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

import { useAppState } from '../services/storageService';
import { AVATARS } from '../constants';

interface BottomDockProps {
  role?: 'explorer' | 'guardian';
}

export const BottomDock: React.FC<BottomDockProps> = ({ role = 'explorer' }) => {
  const location = useLocation();
  const { state } = useAppState();
  const user = state.user;
  const userAvatar = AVATARS.find(a => a.id === user?.avatarId) || AVATARS[0];

  if (role === 'guardian') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavItem to="/guardian/dashboard" icon={Home} label="Home" isActive={location.pathname === '/guardian/dashboard'} />
        <NavItem to="/guardian/history" icon={BarChart2} label="History" isActive={location.pathname === '/guardian/history'} />
      </div>
    )
  }

  // Child (Explorer) Dock
  return (
    <div className="fixed bottom-6 left-6 right-6 bg-white rounded-[2rem] h-20 shadow-soft flex justify-around items-center px-4 z-50">
      <NavItem to="/explorer/dashboard" icon={Home} label="Home" isActive={location.pathname === '/explorer/dashboard'} />
      <NavItem to="/badge-gallery" icon={Gift} label="Badges" isActive={location.pathname === '/badge-gallery'} />

      {/* Dynamic Profile Avatar Button */}
      <NavLink to="/explorer/profile" className="flex flex-col items-center gap-1 w-14 relative">
        <div className={clsx("transition-all duration-300 relative", location.pathname.startsWith('/explorer/profile') ? "-translate-y-2 scale-110" : "")}>
          <div className={clsx("w-10 h-10 rounded-full overflow-hidden border-2 transition-colors", location.pathname.startsWith('/explorer/profile') ? "border-brand-purple shadow-md" : "border-transparent")}>
            <img src={userAvatar.src} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
        <span className={clsx("text-[10px] font-bold font-display transition-colors", location.pathname.startsWith('/explorer/profile') ? "text-brand-purple" : "text-gray-400")}>Profile</span>
        {location.pathname.startsWith('/explorer/profile') && <motion.div layoutId="dot" className="absolute -bottom-2 w-1 h-1 bg-brand-purple rounded-full start-1/2 -translate-x-1/2" />}
      </NavLink>

      <NavItem to="/explorer/zen" icon={Flower} label="Zen Mode" isActive={location.pathname === '/explorer/zen'} />
      <NavItem to="/explorer/vault" icon={BarChart2} label="Vault" isActive={location.pathname === '/explorer/vault'} />
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label, isActive }: { to: string, icon: any, label: string, isActive: boolean }) => (
  <NavLink to={to} className="flex flex-col items-center gap-1 w-14 relative">
    <div className={clsx("transition-all duration-300", isActive ? "-translate-y-1" : "")}>
      <Icon size={24} className={clsx("transition-colors", isActive ? "text-brand-purple" : "text-gray-400")} />
    </div>
    <span className={clsx("text-[10px] font-bold font-display transition-colors", isActive ? "text-brand-purple" : "text-gray-400")}>{label}</span>
    {isActive && <motion.div layoutId="dot" className="absolute -bottom-2 w-1 h-1 bg-brand-purple rounded-full start-1/2 -translate-x-1/2" />}
  </NavLink>
);
