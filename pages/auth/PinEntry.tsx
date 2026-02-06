import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../services/storageService';
import { ArrowLeft, Delete } from 'lucide-react';
import { motion } from 'framer-motion';

export const PinEntry: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { state, loading } = useAppState();
  const savedPin = state.user.pin;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f5ff] text-brand-purple font-bold">Loading...</div>;

  const handleNumClick = (num: number | 'back') => {
    if (num === 'back') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === savedPin) {
          navigate('/guardian/dashboard');
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex flex-col p-6">
      <div className="flex items-center mb-10">
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Anjanaa" className="w-12 h-12 object-contain drop-shadow-md mb-1" />
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Anjanaa</span>
        </div>

        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Set your Guardian PIN</h2>
        <p className="text-gray-500 mb-12">Keep the settings safe from little fingers.</p>

        {/* Dots */}
        <div className="flex gap-6 mb-16">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-brand-purple border-brand-purple scale-110' : 'bg-white border-gray-200'} ${error ? 'border-red-400 bg-red-100' : ''}`}
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
              className="w-20 h-20 rounded-full bg-white shadow-sm text-2xl font-bold font-display text-gray-800 flex items-center justify-center"
            >
              {num}
            </motion.button>
          ))}
          <div />
          <motion.button
            whileTap={{ scale: 0.9, backgroundColor: "#f3e8ff" }}
            onClick={() => handleNumClick(0)}
            className="w-20 h-20 rounded-full bg-white shadow-sm text-2xl font-bold font-display text-gray-800 flex items-center justify-center"
          >
            0
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumClick('back')}
            className="w-20 h-20 rounded-full flex items-center justify-center text-gray-400"
          >
            <Delete size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
