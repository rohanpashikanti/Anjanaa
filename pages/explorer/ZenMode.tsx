import React, { useState, useEffect, useRef } from 'react';
import { BottomDock } from '../../components/BottomDock';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Flame, Smartphone, PlayCircle, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState, adjustGems } from '../../services/storageService';

export const ZenMode: React.FC = () => {
    const navigate = useNavigate();
    const { state, loading } = useAppState();
    // Breathing State
    const [pattern, setPattern] = useState<'box' | '4-7-8' | 'custom'>('box');
    const [customHold, setCustomHold] = useState(4);

    // Reward State
    const [showPinParams, setShowPinParams] = useState<{ type: 'focus' | 'meditation', reward: number } | null>(null);
    const [pin, setPin] = useState('');

    const [breathingText, setBreathingText] = useState('Breathe In');
    const [counter, setCounter] = useState(4);

    // Timer States
    const [focusTime, setFocusTime] = useState(45 * 60); // 45 minutes in seconds
    const [isFocusActive, setIsFocusActive] = useState(false);
    const [meditationActive, setMeditationActive] = useState(false);

    // Focus Timer Logic
    useEffect(() => {
        let interval: any;
        if (isFocusActive && focusTime > 0) {
            interval = setInterval(() => {
                setFocusTime((prev) => prev - 1);
            }, 1000);
        } else if (focusTime === 0 && isFocusActive) {
            setIsFocusActive(false);
            // Trigger Reward Claim
            setShowPinParams({ type: 'focus', reward: 20 });
        }
        return () => clearInterval(interval);
    }, [isFocusActive, focusTime]);

    // Breathing Animation Loop
    useEffect(() => {
        let isActive = true;

        const runCycle = async () => {
            while (isActive) {
                if (pattern === 'box') {
                    // 4-4-4-4
                    setBreathingText('Breathe In'); setCounter(4); await wait(4000);
                    if (!isActive) break;
                    setBreathingText('Hold'); setCounter(4); await wait(4000);
                    if (!isActive) break;
                    setBreathingText('Breathe Out'); setCounter(4); await wait(4000);
                    if (!isActive) break;
                    setBreathingText('Hold'); setCounter(4); await wait(4000);
                } else if (pattern === '4-7-8') {
                    // 4-7-8
                    setBreathingText('Breathe In'); setCounter(4); await wait(4000);
                    if (!isActive) break;
                    setBreathingText('Hold'); setCounter(7); await wait(7000);
                    if (!isActive) break;
                    setBreathingText('Breathe Out'); setCounter(8); await wait(8000);
                } else {
                    // Custom (4-X-4)
                    setBreathingText('Breathe In'); setCounter(4); await wait(4000);
                    if (!isActive) break;
                    setBreathingText('Hold'); setCounter(customHold); await wait(customHold * 1000);
                    if (!isActive) break;
                    setBreathingText('Breathe Out'); setCounter(4); await wait(4000);
                }
            }
        };

        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const interval = setInterval(() => {
            setCounter(c => c > 0 ? c - 1 : 0);
        }, 1000);

        runCycle();

        return () => {
            isActive = false;
            clearInterval(interval);
        }
    }, [pattern, customHold]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        if (pin === state.user.pin) {
            if (showPinParams) {
                await adjustGems(showPinParams.reward);
                alert(`Verified! You earned ${showPinParams.reward} Gems!`);
                setShowPinParams(null);
                setPin('');
                // Reset timers
                if (showPinParams.type === 'focus') {
                    setFocusTime(45 * 60);
                    setIsFocusActive(false);
                }
            }
        } else {
            alert('Incorrect PIN');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] text-brand-purple font-bold">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#fce7f3] pb-24 relative overflow-hidden font-body">

            {/* Header */}
            <div className="p-6 pt-12 flex justify-between items-center relative z-50">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-display font-bold text-gray-900 text-xl">Zen Mode</h1>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-500 fill-orange-500" />
                    <span className="font-bold text-xs text-gray-800">Streak</span>
                </div>
                <div className="relative group">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Settings size={20} className="text-gray-600" />
                    </button>
                    {/* Simple Dropdown for Pattern */}
                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl p-2 w-48 hidden group-hover:block z-50">
                        <p className="text-xs font-bold text-gray-400 mb-2 px-2">BREATHING PATTERN</p>
                        <div
                            onClick={() => setPattern('box')}
                            className={`p-2 rounded-lg text-sm font-bold cursor-pointer ${pattern === 'box' ? 'bg-brand-purple text-white' : 'hover:bg-gray-50'}`}
                        >Box (4-4-4-4)</div>
                        <div
                            onClick={() => setPattern('4-7-8')}
                            className={`p-2 rounded-lg text-sm font-bold cursor-pointer ${pattern === '4-7-8' ? 'bg-brand-purple text-white' : 'hover:bg-gray-50'}`}
                        >Relax (4-7-8)</div>
                        <div
                            onClick={() => setPattern('custom')}
                            className={`p-2 rounded-lg text-sm font-bold cursor-pointer ${pattern === 'custom' ? 'bg-brand-purple text-white' : 'hover:bg-gray-50'}`}
                        >Custom</div>

                        {pattern === 'custom' && (
                            <div className="mt-2 px-2 border-t pt-2">
                                <p className="text-xs text-gray-500">Hold Duration: {customHold}s</p>
                                <input
                                    type="range"
                                    min="2" max="10"
                                    value={customHold}
                                    onChange={(e) => setCustomHold(parseInt(e.target.value))}
                                    className="w-full accent-brand-purple"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Breathing Circle */}
            <div className="flex flex-col items-center justify-center mt-8 relative">
                <div className="w-72 h-72 rounded-full bg-gradient-to-b from-white to-purple-50 shadow-[0_20px_50px_rgba(139,92,246,0.15)] flex items-center justify-center relative z-10 border border-white">
                    {/* Animated Ring */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-[6px] border-brand-purple/20"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="w-64 h-64 bg-white rounded-full flex flex-col items-center justify-center shadow-inner relative z-20"
                    >
                        <span className="text-gray-400 text-lg font-medium mb-1">{breathingText}</span>
                        <span className="text-6xl font-display font-bold text-gray-900">{counter}s</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="h-full bg-orange-400"
                            />
                        </div>
                    </motion.div>
                </div>

                <p className="text-gray-500 text-center mt-8 max-w-xs text-sm">Follow the rhythm to calm your mind.</p>
            </div>

            {/* Cards */}
            <div className="px-6 mt-10 space-y-4">
                {/* Focus Vow */}
                <div className="bg-white rounded-[2rem] p-5 shadow-soft border border-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-400">
                            <Smartphone size={20} />
                        </div>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Focus Vow</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Stay off Mobile</h3>
                    <p className="text-xs text-gray-400 mb-4">Challenge starts now. Can you do it?</p>

                    <div className="bg-gray-50 rounded-2xl p-2 pl-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">TIMER</span>
                            <span className="text-lg font-bold font-mono text-orange-500">{formatTime(focusTime)}</span>
                        </div>
                        <button
                            onClick={() => setIsFocusActive(!isFocusActive)}
                            className={`px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-colors ${isFocusActive ? 'bg-red-400 text-white' : 'bg-orange-500 text-white'}`}
                        >
                            {isFocusActive ? 'Stop' : 'Start'}
                        </button>
                    </div>
                </div>

                {/* Meditation */}
                <div className="bg-gradient-to-r from-brand-purple to-indigo-500 rounded-[2rem] p-5 text-white shadow-lg flex items-center justify-between">
                    <div>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-sm">🧘</span>
                        </div>
                        <h3 className="font-bold text-lg">30m Meditation</h3>
                        <p className="text-xs text-white/70">Guided journey through the calm forest.</p>
                    </div>
                    <button
                        onClick={() => setMeditationActive(!meditationActive)}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-brand-purple transition-colors"
                    >
                        {meditationActive ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                    </button>
                </div>
            </div>

            {/* Verification Modal Overlay */}
            {showPinParams && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold text-center mb-2">Parent Verification</h3>
                        <p className="text-center text-gray-500 mb-6">Enter PIN to verify completion and award {showPinParams.reward} gems.</p>

                        <div className="flex justify-center gap-2 mb-6">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`w-3 h-3 rounded-full ${pin.length > i ? 'bg-brand-purple' : 'bg-gray-200'}`} />
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setPin(p => (p.length < 4 ? p + num : p))}
                                    className="h-12 rounded-xl bg-gray-50 font-bold text-lg active:bg-gray-100"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPinParams(null)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-purple shadow-glow"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomDock />
        </div>
    );
};
