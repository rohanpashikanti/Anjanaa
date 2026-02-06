import React, { useEffect } from 'react';
import { useAppState, updateTaskStatus, checkDailyLogic, markAttendance } from '../../services/storageService';
import { Task, TaskCategory } from '../../types';
import { BottomDock } from '../../components/BottomDock';
import { Gem, Flame, LogOut, CheckCircle, Brain, Sparkles, CalendarCheck } from 'lucide-react';
import { CATEGORY_CONFIG, AVATARS } from '../../constants';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AttendanceButton = ({ checkedIn, onCheckIn }: { checkedIn: boolean, onCheckIn: () => void }) => {
    return (
        <button
            onClick={onCheckIn}
            disabled={checkedIn}
            className={`px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all ${checkedIn ? 'bg-green-100 text-green-600' : 'bg-brand-purple text-white active:scale-95'}`}
        >
            <CalendarCheck size={14} />
            {checkedIn ? 'Present' : 'Check In'}
        </button>
    );
};
export const ExplorerDashboard: React.FC = () => {
    const { state, loading } = useAppState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) checkDailyLogic();
    }, [loading]);

    const handleCompleteTask = (task: Task) => {
        if (task.status === 'pending') {
            updateTaskStatus(task.id, 'completed'); // Now async/void
            // State updates automatically via hook
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff] text-brand-purple font-bold">Loading...</div>;

    // Group tasks logic
    const myTasksCategories: TaskCategory[] = ['Daily Habit', 'Homework', 'Chores', 'Quiet Time', 'Zen Mode'];
    const challengeCategories: TaskCategory[] = ['Brain Power', 'Creative', 'Physical'];

    const myTasks = state.tasks.filter(t => myTasksCategories.includes(t.category));
    const challenges = state.tasks.filter(t => challengeCategories.includes(t.category));

    const renderTaskCard = (task: Task, isCompact = false) => {
        const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG['Daily Habit'];
        const Icon = config.icon;

        return (
            <motion.div
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCompleteTask(task)}
                className={`${isCompact ? 'min-w-[160px] h-44' : 'w-full'} bg-white rounded-3xl p-5 flex flex-col justify-between shadow-soft border border-gray-50 relative overflow-hidden flex-shrink-0`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${config.color.replace('text-', 'text-opacity-80 text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-base leading-tight mb-1">{task.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold">{task.description || config.label}</p>
                </div>

                {/* Progress bar placeholder */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                    <div className={`h-full rounded-full ${task.status === 'completed' || task.status === 'approved' ? 'w-full bg-green-400' : 'w-1/3 bg-brand-purple'}`} />
                </div>

                {/* Checkmark overlay for completed */}
                {(task.status === 'completed' || task.status === 'approved') && (
                    <div className="absolute top-4 right-4 text-green-400 bg-green-50 rounded-full p-1">
                        <div className="w-4 h-4 rounded-full border-2 border-green-400"></div>
                    </div>
                )}
                {task.status === 'pending' && (
                    <div className="absolute top-4 right-4 text-gray-200">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f3e8ff] pb-28 relative overflow-x-hidden font-body">
            {/* Background Gradient Mesh */}
            <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-brand-light/50 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-6 pt-12 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => navigate('/')}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden relative cursor-pointer active:scale-95 transition-transform group"
                    >
                        <img src={state.user.avatarId ? AVATARS.find(a => a.id === state.user.avatarId)?.src : "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"} className="w-full h-full object-cover" alt="Avatar" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <LogOut size={16} className="text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                            ANJANAA EXPLORER
                        </p>
                        <h1 className="text-xl font-display font-bold text-gray-900">{state.user.name || 'Explorer'}'s Hub</h1>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <Gem size={14} className="text-amber-400 fill-amber-400" />
                            <span className="font-bold text-sm text-gray-800">{state.user.gems}</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <Flame size={14} className="text-orange-500 fill-orange-500" />
                            <span className="font-bold text-sm text-gray-800">{state.user.streak}</span>
                        </div>
                    </div>
                    {/* Attendance Button - Only show if not checked in today (simplified logic: check local storage or just state management for session. 
                For persistent daily check, we really need a date stored. 
                For now, let's implement the button and rely on visual feedback or allow multiple check-ins if the user requested "Add a streak button".
                Actually, "attendance" implies once a day. 
                I will add a simple local storage check for 'lastAttendance' to disable it.
            */}
                    <AttendanceButton
                        checkedIn={state.user.lastCheckInDate === new Date().toISOString().split('T')[0]}
                        onCheckIn={() => {
                            markAttendance();
                        }}
                    />
                </div>
            </div>

            <div className="px-6 space-y-8 relative z-10">

                {/* My Tasks Scroll View */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-brand-purple" />
                            <h2 className="text-lg font-bold text-gray-900">My Tasks</h2>
                        </div>
                    </div>

                    {myTasks.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                            {myTasks.map(task => renderTaskCard(task, true))}
                        </div>
                    ) : (
                        <div className="bg-white/50 rounded-2xl p-6 text-center text-gray-500 text-sm">
                            No tasks yet! Ask your parent to add some.
                        </div>
                    )}
                </div>

                {/* Challenges & Brain Power */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Brain size={20} className="text-pink-500" />
                            <h2 className="text-lg font-bold text-gray-900">Challenges</h2>
                        </div>
                    </div>

                    {challenges.length > 0 ? (
                        <div className="space-y-4">
                            {challenges.map(task => {
                                // If it's a specific featured task styling you want, you can check category here
                                // For now, render them as full width cards
                                const config = CATEGORY_CONFIG[task.category];
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={task.id}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleCompleteTask(task)}
                                        className="bg-white rounded-[2rem] p-4 flex items-center justify-between shadow-soft border border-gray-50 relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.color.replace('text-', 'bg-')}`}>
                                                <Icon size={32} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                                                <p className="text-xs text-gray-400 font-bold">{config.label} • {task.reward} Gems</p>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${task.status === 'completed' || task.status === 'approved' ? 'bg-green-100 text-green-500' : 'bg-gray-50 text-gray-400'}`}>
                                            {task.status === 'completed' || task.status === 'approved' ? <CheckCircle size={20} /> : <Sparkles size={20} />}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white/50 rounded-2xl p-6 text-center text-gray-500 text-sm">
                            No active challenges.
                        </div>
                    )}
                </div>
            </div>

            <BottomDock />
        </div>
    );
};
