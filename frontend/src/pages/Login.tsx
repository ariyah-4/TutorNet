import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-800">
                <div className="text-center mb-10">
                    <div className="bg-blue-600/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                        <LogIn className="text-blue-500" size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
                    {/* UPDATED: text-slate-500 -> text-slate-400 */}
                    <p className="text-slate-400 font-medium mt-2">Log in to your TutorNet account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-2xl mb-6 text-xs font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        {/* FIXED: text-slate-500 -> text-slate-300 for visibility */}
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative">
                            {/* UPDATED: text-slate-600 -> text-slate-500 */}
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-500 font-medium"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-500 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {/* UPDATED: text-slate-600 -> text-slate-400 */}
                <p className="text-center mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}