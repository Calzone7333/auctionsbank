import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const message = await resetPassword(token, password);
            setSuccessMessage(message || 'Password reset successfully');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-2">Invalid Link</h2>
                    <p className="text-slate-500 text-sm">The password reset link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 max-w-md w-full relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-[40px] -mr-16 -mt-16"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-[10px] mb-2 block">Security</span>
                        <h2 className="text-2xl font-display font-black text-brand-dark uppercase tracking-tight">Set New Password</h2>
                        <p className="text-slate-500 text-xs mt-2 font-medium">Please enter your new password below.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 border-red-500">
                            <X className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 border-green-500">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <div className="flex flex-col">
                                <span>{successMessage}</span>
                                <span className="text-[10px] opacity-80 mt-1">Redirecting to homepage...</span>
                            </div>
                        </div>
                    )}

                    {!successMessage && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-bold text-brand-dark placeholder-slate-300"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-bold text-brand-dark placeholder-slate-300"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-4 bg-brand-dark text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-brand-blue transition-all duration-300 shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        Update Password
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
