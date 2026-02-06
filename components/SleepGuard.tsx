import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useAppState } from '../services/storageService';

export const SleepGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, loading } = useAppState();

    if (loading) return <>{children}</>;

    return (
        <div className="relative min-h-screen">
            {children}
            <AnimatePresence>
                {state.user.sleepMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-brand-purple/95 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 shadow-2xl max-w-sm w-full flex flex-col items-center"
                        >
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-8">
                                <Moon size={48} className="text-brand-purple fill-brand-purple" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Shhh...</h2>
                            <h3 className="text-xl font-display font-bold text-brand-purple mb-6 uppercase tracking-wider">Sleep Mode Activated</h3>
                            <p className="text-gray-500 font-bold leading-relaxed mb-8 font-body">
                                It's time to rest your brain! The Nexo Universe is currently in exploration pause.
                            </p>
                            <div className="w-full bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200">
                                <p className="text-sm text-gray-400 font-bold uppercase mb-1 font-body">How to Unlock?</p>
                                <p className="text-sm text-gray-600 font-body">Please ask your Parent to turn off Sleep Mode from their Hub.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
