import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton } from '../../components/ClayButton';
import { updateProfile } from '../../services/storageService';
import { AVATARS } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smile, Check, ArrowRight, User } from 'lucide-react';

export const ChildSetup: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl' | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState('');

    const navigate = useNavigate();

    // Filter avatars based on gender
    const filteredAvatars = gender ? AVATARS.filter(a => a.gender === gender) : [];

    // Reset avatar if gender changes
    useEffect(() => {
        setSelectedAvatar('');
    }, [gender]);

    const handleFinish = async () => {
        if (name.trim() && age && gender && selectedAvatar) {
            await updateProfile({
                name,
                age: parseInt(age),
                gender,
                avatarId: selectedAvatar,
                isSetupComplete: true
            });
            navigate('/setup/complete');
        }
    };

    const isFormValid = name.trim() && age && gender && selectedAvatar;

    return (
        <div className="min-h-screen bg-[#fdfaff] flex flex-col p-6 font-body">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-brand-light"></div>
                    <div className="w-8 h-2 rounded-full bg-brand-purple"></div>
                </div>
                <div className="w-10 flex justify-center">
                    <img src="/logo.png" alt="Anjanaa" className="w-8 h-8 object-contain" />
                </div>
            </div>

            <h1 className="text-2xl font-display font-bold text-gray-900 mb-8 text-center">Who is learning today?</h1>

            <div className="space-y-6 mb-8">
                {/* Name Input */}
                <div className="bg-white rounded-2xl p-2 flex items-center shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-purple">
                        <Smile size={20} />
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Explorer's Name"
                        className="flex-1 ml-3 font-bold text-lg text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                    />
                </div>

                {/* Age Input */}
                <div className="bg-white rounded-2xl p-2 flex items-center shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <span className="font-bold text-lg">#</span>
                    </div>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        className="flex-1 ml-3 font-bold text-lg text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                    />
                </div>

                {/* Gender Selection */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3 ml-1">I am a...</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setGender('boy')}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${gender === 'boy' ? 'border-blue-400 bg-blue-50' : 'border-transparent bg-white shadow-sm'}`}
                        >
                            <span className="text-2xl">👦</span>
                            <span className="font-bold text-gray-700">Boy</span>
                        </div>
                        <div
                            onClick={() => setGender('girl')}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${gender === 'girl' ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white shadow-sm'}`}
                        >
                            <span className="text-2xl">👧</span>
                            <span className="font-bold text-gray-700">Girl</span>
                        </div>
                    </div>
                </div>

                {/* Avatar Selection - Only visible if gender selected */}
                <AnimatePresence>
                    {gender && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-4 mt-2">
                                <h3 className="font-bold text-gray-800">Choose an Avatar</h3>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {filteredAvatars.map((avatar) => (
                                    <motion.div
                                        key={avatar.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedAvatar(avatar.id)}
                                        className={`relative aspect-square rounded-2xl p-1 cursor-pointer transition-all ${selectedAvatar === avatar.id ? 'bg-gradient-to-tr from-brand-purple to-pink-400' : 'bg-transparent'}`}
                                    >
                                        <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white bg-gray-100 relative">
                                            <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                                        </div>
                                        {selectedAvatar === avatar.id && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-purple text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-auto">
                <ClayButton
                    onClick={handleFinish}
                    disabled={!isFormValid}
                    fullWidth
                    className={!isFormValid ? 'opacity-50' : 'shadow-glow !bg-blue-500 hover:!bg-blue-600 active:!bg-blue-700'}
                >
                    Continue <ArrowRight size={20} className="ml-2 inline-block" />
                </ClayButton>
            </div>
        </div>
    );
};