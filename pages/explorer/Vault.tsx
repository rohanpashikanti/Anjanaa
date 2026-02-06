import React, { useState } from 'react';
import { useAppState, purchaseReward, addReward } from '../../services/storageService';
import { BADGES } from '../../constants';
import { BottomDock } from '../../components/BottomDock';
import { ArrowLeft, Gem, Plus, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reward } from '../../types';

export const Vault: React.FC = () => {
    const navigate = useNavigate();
    const { state, loading } = useAppState();
    const { user, rewards } = state;
    const [activeTab, setActiveTab] = useState<'collection' | 'store'>('store');
    const [showAddReward, setShowAddReward] = useState(false);
    const [pin, setPin] = useState('');
    const [isParentMode, setIsParentMode] = useState(false);

    // New Reward State
    const [newReward, setNewReward] = useState({ title: '', cost: '', image: '🎁' });

    const handleAddReward = async () => {
        if (newReward.title && newReward.cost) {
            await addReward({
                id: Date.now().toString(),
                title: newReward.title,
                cost: parseInt(newReward.cost),
                image: newReward.image,
                type: 'item',
                purchased: false
            });
            setNewReward({ title: '', cost: '', image: '🎁' });
            setIsParentMode(false);
        }
    };

    const verifyParent = () => {
        if (pin === state.user.pin) {
            setIsParentMode(true);
            setPin('');
        } else {
            alert('Incorrect PIN');
        }
    };

    const handleClaim = async (reward: Reward) => {
        const success = await purchaseReward(reward.id);
        if (success) {
            alert(`You claimed: ${reward.title}!`);
        } else {
            if (user.gems < reward.cost) alert("Not enough Gems!");
            else if (reward.isLocked) alert("This reward is locked!");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff] text-brand-purple font-bold">Loading...</div>;

    // Filter rewards: Store shows items that aren't purchased OR vouchers (which can be re-bought technically, but here we show them if not purchased for simplicity, or we can keep them in store always. Prompt says collection should have claimed rewards).
    // Let's keep vouchers in store always? Or if purchased, they move?
    // If I move them to collection, I can't buy them again unless I have logic for duplicates.
    // The user said "Collection should have the badges... and the claimed rewards".
    // So purchased vouchers go to collection.

    const storeItems = rewards.filter(r => !r.purchased);
    const collectionItems = rewards.filter(r => r.purchased);

    return (
        <div className="min-h-screen bg-[#f3e8ff] pb-24 font-body">

            {/* Header */}
            <div className="p-6 pt-12 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="text-center">
                    <h1 className="font-display font-bold text-brand-dark text-2xl">Rewards</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SPEND YOUR GEMS</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-brand-purple">
                    <Gem size={14} fill="currentColor" />
                    <span className="font-bold text-sm text-gray-800">{user.gems}</span>
                </div>
                <button
                    onClick={() => setShowAddReward(true)}
                    className="w-10 h-10 ml-2 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-purple"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-8">
                <div className="bg-white p-1 rounded-full flex shadow-sm">
                    <button
                        onClick={() => setActiveTab('store')}
                        className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'store' ? 'bg-brand-purple text-white shadow-md' : 'text-gray-400'}`}
                    >
                        The Store
                    </button>
                    <button
                        onClick={() => setActiveTab('collection')}
                        className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'collection' ? 'bg-brand-purple text-white shadow-md' : 'text-gray-400'}`}
                    >
                        My Collection
                    </button>
                </div>
            </div>

            <div className="px-6 pb-6">

                {activeTab === 'store' && (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-brand-purple font-bold text-lg">🛍</span>
                            <h2 className="font-bold text-gray-900 text-lg">Claim Rewards</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {storeItems.map(item => (
                                <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-white flex flex-col justify-between">
                                    <div>
                                        <div className="relative w-full h-24 bg-gradient-to-b from-teal-50 to-teal-100 rounded-2xl mb-3 overflow-hidden flex items-center justify-center text-4xl">
                                            {item.image.startsWith('http') || item.image.startsWith('/') ? (
                                                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                            ) : item.image}
                                        </div>
                                        <h3 className="font-bold text-gray-900 leading-tight mb-1 text-sm">{item.title}</h3>
                                        <p className="text-[10px] text-gray-400 mb-3">{item.type === 'voucher' ? 'Ask Parent to redeem' : 'Unlock item'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleClaim(item)}
                                        disabled={user.gems < item.cost}
                                        className={`w-full py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all ${user.gems >= item.cost ? 'bg-brand-purple text-white shadow-glow' : 'bg-gray-200 text-gray-400'}`}
                                    >
                                        <Gem size={12} fill="currentColor" /> {item.cost}
                                    </button>
                                </div>
                            ))}
                            {storeItems.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-gray-400">Store is empty!</div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'collection' && (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-brand-purple font-bold text-lg">🎖</span>
                            <h2 className="font-bold text-gray-900 text-lg">My Badges & Items</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {collectionItems.map(item => (
                                <div key={item.id} className={`bg-white rounded-[2rem] p-4 flex flex-col items-center text-center shadow-sm border border-white`}>
                                    <div className={`w-24 h-24 mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-50 to-white text-4xl`}>
                                        {item.image.startsWith('http') || item.image.startsWith('/') ? (
                                            <img src={item.image} className="w-16 h-16 object-contain drop-shadow-md" alt={item.title} />
                                        ) : item.image}
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-purple-100 text-purple-600">
                                        OWNED
                                    </span>
                                </div>
                            ))}
                            {collectionItems.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-gray-400">Buy something from the store!</div>
                            )}
                        </div>
                    </>
                )}

            </div>

            {/* Add Reward Modal */}
            {showAddReward && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Add Reward</h3>
                            <button onClick={() => { setShowAddReward(false); setIsParentMode(false); }}><X size={24} /></button>
                        </div>

                        {!isParentMode ? (
                            <div>
                                <p className="text-gray-500 mb-4">Enter Parent PIN to add rewards.</p>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${pin.length > i ? 'bg-brand-purple' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
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
                                <button
                                    onClick={verifyParent}
                                    className="w-full py-3 rounded-xl font-bold text-white bg-brand-purple shadow-glow"
                                >
                                    Verify
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block">Reward Title</label>
                                    <input
                                        type="text"
                                        value={newReward.title}
                                        onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 font-bold outline-none"
                                        placeholder="e.g. 1 Hour TV"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block">Cost (Gems)</label>
                                    <input
                                        type="number"
                                        value={newReward.cost}
                                        onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 font-bold outline-none"
                                        placeholder="50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        value={newReward.image}
                                        onChange={(e) => setNewReward({ ...newReward, image: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 font-bold outline-none"
                                        placeholder="🎁"
                                    />
                                </div>
                                <button
                                    onClick={handleAddReward}
                                    className="w-full py-3 rounded-xl font-bold text-white bg-brand-purple shadow-glow mt-4"
                                >
                                    Create Reward
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <BottomDock />
        </div>
    );
};
