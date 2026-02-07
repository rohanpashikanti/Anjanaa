import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, approveTask, rejectTask, addTask, addReward, adjustGems, deleteReward, deleteTask, updateProfile } from '../../services/storageService';
import { AppState, Task, Reward, TaskCategory } from '../../types';
import { BottomDock } from '../../components/BottomDock';
import { Settings, Moon, Trophy, Hourglass, Check, X, Image as ImageIcon, Plus, Gift, Trash2, Zap, LayoutGrid, LogOut, Calendar, RefreshCw, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_CONFIG } from '../../constants';

export const GuardianDashboard: React.FC = () => {
    const { state, loading } = useAppState();
    const navigate = useNavigate();

    // Modals State
    const [activeModal, setActiveModal] = useState<'quest' | 'reward' | 'bonus' | null>(null);

    // Quest Form State
    const [questTitle, setQuestTitle] = useState('');
    const [questCategory, setQuestCategory] = useState<TaskCategory>('Daily Habit');
    const [questReward, setQuestReward] = useState(10);
    const [isRecurring, setIsRecurring] = useState(false);

    // Reward Form State
    const [rewardTitle, setRewardTitle] = useState('');
    const [rewardCost, setRewardCost] = useState(100);
    const [rewardEmoji, setRewardEmoji] = useState('🎁');

    // Bonus Form State
    const [bonusAmount, setBonusAmount] = useState(0);
    const [bonusReason, setBonusReason] = useState('');

    const REWARD_EMOJIS = ['🎁', '🍦', '🎮', '📺', '🎟️', '🍕', '🎨', '⚽', '🧸', '📱', '💻', '🎧'];


    const handleApprove = async (task: Task) => {
        await approveTask(task.id);
    };

    const handleReject = async (task: Task) => {
        await rejectTask(task.id);
    };


    const handleCreateQuest = async () => {
        if (!questTitle) return;
        const newTask: Task = {
            id: Date.now().toString(),
            title: questTitle,
            category: questCategory,
            reward: questReward,
            xp: questReward * 2, // Simple logic for XP
            status: 'pending',
            isRecurring: isRecurring,
            createdAt: Date.now(),
            userId: state.user.id,
        };
        await addTask(newTask);
        setQuestTitle('');
        setIsRecurring(false);
        setActiveModal(null);
    };

    const handleCreateReward = async () => {
        if (!rewardTitle) return;
        const newReward: Reward = {
            id: Date.now().toString(),
            title: rewardTitle,
            cost: rewardCost,
            image: rewardEmoji, // Use selected emoji
            type: 'voucher',
            purchased: false
        };
        await addReward(newReward);
        setRewardTitle('');
        setRewardEmoji('🎁');
        setActiveModal(null);
    };

    const handleAdjustGems = async () => {
        if (bonusAmount === 0) return;
        await adjustGems(bonusAmount, bonusReason); // Pass reason
        setBonusAmount(0);
        setBonusReason('');
        setActiveModal(null);
    }


    const handleDeleteReward = async (id: string) => {
        await deleteReward(id);
    }

    const handleDeleteTask = async (id: string) => {
        await deleteTask(id);
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8faff] text-brand-dark font-bold">Loading...</div>;

    // Derived Stats
    const waitingApprovals = state.tasks.filter(t => t.status === 'completed');
    const fixedTasks = state.tasks.filter(t => t.isRecurring);
    const activeQuests = state.tasks.filter(t => t.status === 'pending' && !t.isRecurring);
    const totalCompleted = state.user.questsCompleted;
    const gemsThisWeek = state.user.gemsThisWeek;

    return (
        <div className="min-h-screen bg-[#f8faff] pb-24 font-body relative overflow-hidden">

            {/* Header */}
            <div className="p-6 pt-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => navigate('/')}
                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer active:scale-95 transition-transform"
                    >
                        <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg" className="w-full h-full object-cover" alt="Parent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-brand-dark">Anjanaa Parent Hub</h1>
                        <p className="text-xs text-gray-400">Control Center</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-400 active:scale-95 transition-colors"
                    title="Switch Profile"
                >
                    <LogOut size={20} />
                </button>
            </div>

            <div className="px-6 space-y-6">

                {/* Real-time Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2rem] p-5 flex flex-col items-center justify-center text-center shadow-soft">
                        <div className="w-10 h-10 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mb-2">
                            <Trophy size={20} />
                        </div>
                        <span className="text-3xl font-display font-bold text-gray-900">{totalCompleted}</span>
                        <span className="text-xs font-bold text-gray-400">Total Tasks Done</span>
                    </div>
                    <div className="bg-white rounded-[2rem] p-5 flex flex-col items-center justify-center text-center shadow-soft">
                        <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-2">
                            <Gift size={20} />
                        </div>
                        <span className="text-3xl font-display font-bold text-gray-900">{gemsThisWeek}</span>
                        <span className="text-xs font-bold text-gray-400">Gems Earned (Week)</span>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setActiveModal('quest')}
                        className="bg-white p-4 rounded-2xl shadow-soft flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                        <div className="w-10 h-10 bg-purple-100 text-brand-purple rounded-full flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">New Quest</span>
                    </button>
                    <button
                        onClick={() => setActiveModal('reward')}
                        className="bg-white p-4 rounded-2xl shadow-soft flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Gift size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">Add Reward</span>
                    </button>
                    <button
                        onClick={() => setActiveModal('bonus')}
                        className="bg-white p-4 rounded-2xl shadow-soft flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">Adjust Gems</span>
                    </button>
                </div>

                {/* Sleep Mode */}
                <div className="bg-brand-purple rounded-[2rem] p-5 text-white flex items-center justify-between shadow-glow relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Moon size={20} className="text-white" fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Sleep Mode</h3>
                            <p className="text-xs text-white/70">Lock app for bedtime</p>
                        </div>
                    </div>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateProfile({ sleepMode: !state.user.sleepMode })}
                        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors relative z-10 flex ${state.user.sleepMode ? 'bg-green-400 justify-end' : 'bg-black/20 justify-start'}`}
                    >
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            className="w-5 h-5 bg-white rounded-full shadow-md"
                        />
                    </motion.div>
                </div>

                {/* Approvals */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-display font-bold text-gray-900">Task Verification</h2>
                        <span className="bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-md text-xs font-bold">{waitingApprovals.length} Pending</span>
                    </div>

                    <div className="space-y-4">
                        {waitingApprovals.length === 0 ? (
                            <div className="text-center py-6 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Check size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">All tasks verified!</p>
                            </div>
                        ) : (
                            waitingApprovals.map(task => (
                                <div key={task.id} className="bg-white rounded-[2rem] p-4 shadow-soft border border-gray-50">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden">
                                            {task.image ? (
                                                <img src="https://img.freepik.com/free-vector/tower-made-cubes-toy_1308-132644.jpg" className="w-full h-full object-cover" alt="Task" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{task.title}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{task.description || "Task completed!"}</p>
                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">+{task.reward} Gems</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(task)}
                                            className="flex-[2] bg-green-500 text-white py-2 rounded-xl font-bold text-sm shadow-md active:scale-95"
                                        >
                                            Verify & Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(task)}
                                            className="flex-1 bg-white border-2 border-red-500 text-red-500 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </div>


                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Active Challenges / One-Time Quests */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-display font-bold text-gray-900">Active Quests</h2>
                        <span className="bg-purple-50 text-purple-500 px-2 py-1 rounded-md text-xs font-bold">{activeQuests.length} Active</span>
                    </div>
                    <div className="space-y-2">
                        {activeQuests.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                                        <Star size={14} />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-700 text-sm block">{task.title}</span>
                                        <span className="text-[10px] text-gray-400 uppercase">{task.category}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {activeQuests.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">No active quests.</div>
                        )}
                    </div>
                </div>

                {/* Fixed Daily Tasks Management */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-display font-bold text-gray-900">Fixed Daily Tasks</h2>
                        <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-md text-xs font-bold">{fixedTasks.length} Active</span>
                    </div>
                    <div className="space-y-2">
                        {fixedTasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                        <RefreshCw size={14} />
                                    </div>
                                    <span className="font-bold text-gray-700 text-sm">{task.title}</span>
                                </div>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {fixedTasks.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">No fixed daily tasks set. Add one via New Quest.</div>
                        )}
                    </div>
                </div>

                {/* Rewards Management Preview */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-display font-bold text-gray-900">Active Store Rewards</h2>
                    </div>
                    <div className="space-y-2">
                        {state.rewards.filter(r => r.type === 'voucher').map(reward => (
                            <div key={reward.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
                                <span className="font-bold text-gray-700 text-sm">{reward.title}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-amber-500">{reward.cost} G</span>
                                    <button onClick={() => handleDeleteReward(reward.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"
                            >
                                <X size={18} />
                            </button>

                            {activeModal === 'quest' && (
                                <>
                                    <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Create New Quest</h2>
                                    <input
                                        type="text"
                                        placeholder="Quest Title (e.g. Read a book)"
                                        value={questTitle}
                                        onChange={e => setQuestTitle(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 font-bold outline-none focus:ring-2 ring-brand-purple/20"
                                    />

                                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                                        {Object.keys(CATEGORY_CONFIG).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setQuestCategory(cat as TaskCategory);
                                                    if (cat === 'Daily Habit') setIsRecurring(true);
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${questCategory === cat ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-xl">
                                        <span className="text-sm font-bold text-gray-600">Repeat Daily?</span>
                                        <div
                                            onClick={() => setIsRecurring(!isRecurring)}
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isRecurring ? 'bg-brand-purple' : 'bg-gray-300'}`}
                                        >
                                            <motion.div
                                                layout
                                                className={`w-4 h-4 bg-white rounded-full shadow-sm ${isRecurring ? 'translate-x-4' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm font-bold text-gray-500">Reward:</span>
                                        {[10, 25, 50, 100].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setQuestReward(amt)}
                                                className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border-2 transition-colors ${questReward === amt ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400'}`}
                                            >
                                                {amt}
                                            </button>
                                        ))}
                                    </div>

                                    <button onClick={handleCreateQuest} className="w-full bg-brand-purple text-white py-3 rounded-xl font-bold shadow-glow">Create Quest</button>
                                </>
                            )}

                            {activeModal === 'reward' && (
                                <>
                                    <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Create Reward</h2>
                                    <input
                                        type="text"
                                        placeholder="Reward (e.g. 30 mins TV)"
                                        value={rewardTitle}
                                        onChange={e => setRewardTitle(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 font-bold outline-none focus:ring-2 ring-green-400/20"
                                    />

                                    <div className="mb-6">
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">Cost in Gems</label>
                                        <input
                                            type="number"
                                            value={rewardCost}
                                            onChange={e => setRewardCost(Number(e.target.value))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 font-bold outline-none"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">Choose Icon</label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {REWARD_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => setRewardEmoji(emoji)}
                                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg border-2 transition-all ${rewardEmoji === emoji ? 'border-brand-purple bg-purple-50 scale-110' : 'border-transparent hover:bg-gray-50'}`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                    <button onClick={handleCreateReward} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg">Add to Store</button>
                                </>
                            )}

                            {activeModal === 'bonus' && (
                                <>
                                    <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Adjust Gems</h2>
                                    <p className="text-xs text-gray-500 mb-6">Gift extra gems or deduct for behavior.</p>

                                    <div className="flex justify-center items-center gap-6 mb-6">
                                        <button onClick={() => setBonusAmount(prev => prev - 10)} className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold text-xl">-</button>
                                        <span className={`text-3xl font-bold font-display ${bonusAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {bonusAmount > 0 ? '+' : ''}{bonusAmount}
                                        </span>
                                        <button onClick={() => setBonusAmount(prev => prev + 10)} className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center font-bold text-xl">+</button>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">Reason (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Extra Chores, Good Behavior"
                                            value={bonusReason}
                                            onChange={e => setBonusReason(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 font-bold outline-none focus:ring-2 ring-gray-200"
                                        />
                                    </div>


                                    <button onClick={handleAdjustGems} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg">Apply Adjustment</button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BottomDock role="guardian" />
        </div>
    );
};