import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../services/storageService';
import { GemTransaction } from '../../types';
import { BottomDock } from '../../components/BottomDock';
import {
    ArrowLeft,
    LogOut,
    TrendingUp,
    ShoppingBag,
    Book,
    IceCream,
    Bed,
    Sparkles,
    Brain,
    Gem,
    Clock,
    Plus,
    Minus
} from 'lucide-react';
import { AVATARS } from '../../constants';

export const ClaimedHistory: React.FC = () => {
    const navigate = useNavigate();
    const { state, loading } = useAppState();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8faff] text-brand-dark font-bold">Loading...</div>;

    const { transactions, user } = state;
    const userAvatar = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];

    // Date Logic
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const todayTxs = transactions.filter(t => t.createdAt.startsWith(todayStr));
    const yesterdayTxs = transactions.filter(t => t.createdAt.startsWith(yesterdayStr));
    const olderTxs = transactions.filter(t => !t.createdAt.startsWith(todayStr) && !t.createdAt.startsWith(yesterdayStr));

    const earnedToday = todayTxs.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const spentToday = todayTxs.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const TransactionItem: React.FC<{ tx: GemTransaction }> = ({ tx }) => {
        const isPositive = tx.amount > 0;

        // Dynamic Icon Logic
        const getIcon = () => {
            const titleLower = tx.title.toLowerCase();
            if (titleLower.includes('read')) return <Book size={20} />;
            if (titleLower.includes('ice cream') || titleLower.includes('treat')) return <IceCream size={20} />;
            if (titleLower.includes('bed')) return <Bed size={20} />;
            if (titleLower.includes('streak')) return <Sparkles size={20} />;
            if (titleLower.includes('math') || titleLower.includes('challenge')) return <Brain size={20} />;
            if (tx.type === 'reward') return <ShoppingBag size={20} />;
            return <Gem size={20} />;
        };

        const getIconBg = () => {
            if (tx.title.toLowerCase().includes('read')) return 'bg-orange-100 text-orange-400';
            if (tx.title.toLowerCase().includes('ice cream')) return 'bg-red-100 text-red-100'; // Wait, red-100 text-red-400
            if (tx.title.toLowerCase().includes('ice cream')) return 'bg-[#fce7f3] text-red-400';
            if (tx.title.toLowerCase().includes('bed')) return 'bg-blue-100 text-blue-400';
            if (tx.title.toLowerCase().includes('streak')) return 'bg-purple-100 text-purple-400';
            if (tx.title.toLowerCase().includes('math')) return 'bg-green-100 text-green-400';
            return 'bg-gray-100 text-gray-400';
        };

        return (
            <div className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center justify-between border border-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconBg()}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{tx.title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {tx.category || (tx.type === 'reward' ? 'Reward' : 'Update')} • {formatTime(tx.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className={`text-lg font-bold font-display ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : '-'}{Math.abs(tx.amount)}
                    </span>
                    <Gem size={12} className="text-amber-400 fill-amber-400" />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8faff] pb-32 font-body">
            {/* Header */}
            <div className="p-6 pt-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src={userAvatar.src} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900 leading-tight">History</h1>
                        <p className="text-xs font-bold text-gray-400">Gem Transactions</p>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="px-6 flex gap-4 mt-6">
                <div className="flex-1 bg-white p-6 rounded-[2.5rem] shadow-soft border border-gray-50 flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-2">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earned Today</span>
                    <span className="text-2xl font-display font-bold text-green-500 mt-1">+{earnedToday}</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-[2.5rem] shadow-soft border border-gray-50 flex flex-col items-center">
                    <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 mb-2">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spent Today</span>
                    <span className="text-2xl font-display font-bold text-red-500 mt-1">-{spentToday}</span>
                </div>
            </div>

            {/* List */}
            <div className="px-6 mt-10 space-y-8">
                {/* Today */}
                {todayTxs.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h2 className="text-lg font-bold text-gray-900">Today</h2>
                            <span className="text-[10px] font-bold bg-[#8b5cf6]/10 text-brand-purple px-2 py-1 rounded-lg uppercase">
                                {todayTxs.length} Items
                            </span>
                        </div>
                        <div className="space-y-3">
                            {todayTxs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(tx => (
                                <TransactionItem key={tx.id} tx={tx} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Yesterday */}
                {yesterdayTxs.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h2 className="text-lg font-bold text-gray-900">Yesterday</h2>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-lg uppercase">
                                {yesterdayTxs.length} Items
                            </span>
                        </div>
                        <div className="space-y-3">
                            {yesterdayTxs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(tx => (
                                <TransactionItem key={tx.id} tx={tx} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Older (optional) */}
                {olderTxs.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h2 className="text-lg font-bold text-gray-900">Older</h2>
                        </div>
                        <div className="space-y-3">
                            {olderTxs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(tx => (
                                <TransactionItem key={tx.id} tx={tx} />
                            ))}
                        </div>
                    </div>
                )}

                {transactions.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="font-bold text-gray-400">No transactions yet</p>
                    </div>
                )}
            </div>

            <BottomDock role="guardian" />
        </div>
    );
};
