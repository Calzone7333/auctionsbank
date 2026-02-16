import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Gavel, CheckCircle2, Phone, ShieldCheck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, user: currentUser } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            // Reset fields
            setEmail('');
            setPassword('');
            setName('');
            setPhone('');
        }
    }, [isOpen, initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                const loggedInUser = await login(email, password);
                if (loggedInUser.role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            } else {
                await register(name, email, password);
                navigate('/');
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Container - Reduced Size */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-30 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-aq-gold hover:text-white transition-all transform hover:rotate-90"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left Side: Info/Branding (Hidden on small screens) */}
                <div className="hidden md:flex md:w-[38%] bg-aq-blue p-8 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.15)_0%,transparent_50%)]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                                <Gavel className="text-aq-gold h-5 w-5" />
                            </div>
                            <span className="text-lg font-display font-bold">Aquection<span className="text-aq-gold">.</span></span>
                        </div>

                        <h2 className="text-2xl font-display font-bold leading-tight mb-6">
                            {mode === 'login' ? 'Welcome Back to Your Portal' : 'Start Your Investment Journey'}
                        </h2>

                        <div className="space-y-4">
                            {[
                                'Access 10,000+ Active Auctions',
                                'Instant Mobile & Email Alerts',
                                'Verified Bank Documentation',
                                'Professional Legal Support'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-aq-gold/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-aq-gold" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-aq-gold" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">100% Secure Access</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium">© 2025 Aquection India.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-white relative">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-0.5">
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-medium">
                                        {mode === 'login'
                                            ? 'Enter your credentials below.'
                                            : 'Fill in the details to get started.'}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-[11px] font-bold leading-relaxed shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <X className="w-3.5 h-3.5" />
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aq-gold/20 focus:border-aq-gold transition-all text-sm font-medium"
                                        />
                                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-aq-gold transition-colors" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@email.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aq-gold/20 focus:border-aq-gold transition-all text-sm font-medium"
                                    />
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-aq-gold transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    {mode === 'login' && (
                                        <button type="button" className="text-[9px] font-black text-aq-blue hover:text-aq-gold uppercase tracking-widest transition-colors">Forgot?</button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aq-gold/20 focus:border-aq-gold transition-all text-sm font-medium"
                                    />
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-aq-gold transition-colors" />
                                </div>
                            </div>



                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 mt-2 bg-aq-blue text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign In Now' : 'Create My Account'}
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-[13px] font-medium text-slate-500">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                    className="ml-2 text-aq-gold font-black hover:underline transition-all"
                                >
                                    {mode === 'login' ? 'Register Free' : 'Sign In Now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
