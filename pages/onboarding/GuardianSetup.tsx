import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton } from '../../components/ClayButton';
import { AuthService } from '../../services/authService';
import { motion } from 'framer-motion';

export const GuardianSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'name' | 'pin'>('name');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNumClick = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleContinueName = () => {
    if (name.trim()) setStep('pin');
  };

  const handleSave = async () => {
    if (pin.length !== 4) return;
    setLoading(true);
    try {
      await AuthService.register(name, pin, 'guardian');
      navigate('/setup/child');
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Name might be taken.");
      setStep('name');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex flex-col p-6">
      <div className="flex items-center mb-10 gap-3">
        <img src="/logo.png" alt="Anjanaa" className="w-10 h-10 object-contain" />
        <span className="font-display font-bold text-xl text-brand-purple">Anjanaa</span>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-sm mx-auto w-full">
        {step === 'name' ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">What is your name?</h2>
            <p className="text-gray-500 mb-8">This will be your username.</p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 ring-brand-purple mb-8 text-center text-lg font-bold text-gray-800"
            />

            <button
              onClick={handleContinueName}
              disabled={!name.trim()}
              className="w-full bg-brand-purple text-white py-4 px-6 rounded-full font-bold text-lg shadow-glow flex items-center justify-between group active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-purple transition-colors">→</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Create Parent PIN</h2>
            <p className="text-gray-500 mb-8">Keep settings safe from little explorers.</p>

            {/* Dots */}
            <div className="flex gap-6 mb-12">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-brand-purple border-brand-purple scale-110' : 'bg-white border-gray-200'}`}
                />
              ))}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.9, backgroundColor: "#f3e8ff" }}
                  onClick={() => handleNumClick(num)}
                  className="w-20 h-20 rounded-full bg-white shadow-sm text-2xl font-bold font-display text-gray-800 flex items-center justify-center cursor-pointer"
                  disabled={loading}
                >
                  {num}
                </motion.button>
              ))}
              <div />
              <motion.button
                whileTap={{ scale: 0.9, backgroundColor: "#f3e8ff" }}
                onClick={() => handleNumClick(0)}
                className="w-20 h-20 rounded-full bg-white shadow-sm text-2xl font-bold font-display text-gray-800 flex items-center justify-center cursor-pointer"
                disabled={loading}
              >
                0
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="w-20 h-20 rounded-full flex items-center justify-center text-gray-400 cursor-pointer"
                disabled={loading}
              >
                Clear
              </motion.button>
            </div>

            {pin.length === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[280px] mt-8"
              >
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-brand-purple text-white py-4 px-6 rounded-full font-bold text-lg shadow-glow flex items-center justify-between group active:scale-95 transition-transform"
                >
                  {loading ? 'Registering...' : 'Create Account'}
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-purple transition-colors">→</span>
                </button>
              </motion.div>
            )}
            <button
              onClick={() => setStep('name')}
              className="mt-6 w-full bg-brand-purple text-white py-4 px-6 rounded-full font-bold text-lg shadow-glow flex items-center justify-between group active:scale-95 transition-transform"
            >
              Back to Name
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-purple transition-colors">←</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
