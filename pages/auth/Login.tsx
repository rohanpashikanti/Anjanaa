import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { ClayButton } from '../../components/ClayButton';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await AuthService.login(username, pin);
            if (user) {
                navigate('/');
            } else {
                setError('Invalid username or PIN');
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Temporary Test Helper Removed


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] to-[#e0e7ff] flex items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-xl items-center flex flex-col">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="Anjanaa" className="w-16 h-16 object-contain drop-shadow-md mb-2" />
                    <h2 className="text-xl font-display font-bold text-gray-800">Anjanaa</h2>
                </div>

                <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Welcome Back!</h1>
                <p className="text-gray-500 mb-8 text-sm">Sign in to continue your adventure.</p>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                        <User size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="bg-transparent w-full outline-none font-bold text-gray-700"
                        />
                    </div>

                    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                        <Lock size={20} className="text-gray-400" />
                        <input
                            type="password"
                            placeholder="PIN"
                            maxLength={4}
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            className="bg-transparent w-full outline-none font-bold text-gray-700"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !username || !pin}
                        className="w-full bg-brand-purple text-white py-4 px-6 rounded-full font-bold text-lg shadow-glow flex items-center justify-between group active:scale-95 transition-transform mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-purple transition-colors">
                            <ArrowRight size={20} />
                        </span>
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 w-full text-center">
                    <p className="text-gray-400 text-xs mb-2">First time here?</p>
                    <button onClick={() => navigate('/setup/guardian')} className="text-brand-purple font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:underline">
                        <UserPlus size={16} /> Create User
                    </button>
                </div>
            </div>
        </div>
    );
};
