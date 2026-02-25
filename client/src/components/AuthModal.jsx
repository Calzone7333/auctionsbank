import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Gavel, CheckCircle2, Phone, ShieldCheck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot' | 'reset-otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, googleLogin, forgotPassword, user: currentUser } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            setSuccessMessage('');
            // Reset fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setOtp('');
            setName('');
            setPhone('');
        }
    }, [isOpen, initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            if (mode === 'login') {
                const loggedInUser = await login(email, password);
                if (loggedInUser.role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
                onClose();
            } else if (mode === 'forgot') {
                const message = await forgotPassword(email);
                setSuccessMessage(message || 'OTP sent to your email.');
                setMode('reset-otp');
            } else if (mode === 'reset-otp') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const message = await resetPassword(email, otp, password);
                setSuccessMessage(message || 'Password reset successful. You can now login.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
                setOtp('');
            } else {
                await register(name, email, password);
                navigate('/');
                onClose();
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const data = await googleLogin(credentialResponse.credential);
            if (data?.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Google Auth failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
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
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-slate-50 text-slate-400 hover:bg-brand-blue hover:text-white transition-all transform hover:rotate-90 group shadow-sm"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left Side: Info/Branding */}
                <div className="hidden md:flex md:w-[35%] bg-brand-dark p-8 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                                <Gavel className="text-brand-blue h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Madrasauction</span>
                                <span className="text-[7px] font-bold text-brand-blue uppercase tracking-[0.3em]">Property Auctions</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-display font-black leading-[1.1] mb-6 uppercase tracking-tight">
                            {mode === 'login' ? 'Welcome Back to Your Portal' : 'Start Your Investment Journey'}
                        </h2>

                        <div className="space-y-4">
                            {[
                                '10,000+ Active Auctions',
                                'Instant System Alerts',
                                'Verified Bank Docs',
                                '24/7 Legal Support'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue transition-colors">
                                        <CheckCircle2 className="w-3 h-3 text-brand-blue group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-4 h-4 text-brand-blue" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">100% Secure Access</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© 2025 Madrasauction India.</p>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center bg-white">
                    <div className="max-w-[300px] mx-auto w-full">
                        <div className="mb-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-[8px] mb-2 block">Authentication</span>
                                    <h3 className="text-2xl font-display font-black text-brand-dark mb-1 uppercase tracking-tight">
                                        {mode === 'login' ? 'Sign In' : (mode === 'forgot' || mode === 'reset-otp') ? 'Reset Password' : 'Create Account'}
                                    </h3>
                                    <p className="text-slate-400 text-[11px] font-medium">
                                        {mode === 'login'
                                            ? 'Enter your credentials to access.'
                                            : mode === 'forgot'
                                                ? 'Enter your email to receive an OTP.'
                                                : mode === 'reset-otp'
                                                    ? 'Enter the 6-digit OTP sent to your email.'
                                                    : 'Join our smart property community.'}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-[9px] font-black uppercase tracking-widest border-l-4 border-red-500 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <X className="w-3 h-3 shrink-0" />
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-2 bg-green-50 text-green-700 rounded-md text-[9px] font-black uppercase tracking-widest border-l-4 border-green-500 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    {successMessage}
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300"
                                        />
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                    </div>
                                </div>
                            )}

                            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@email.com"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                    </div>
                                </div>
                            )}

                            {mode === 'reset-otp' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">6-Digit OTP</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="123456"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300 tracking-widest"
                                            />
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300"
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300"
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {(mode === 'login' || mode === 'register') && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Password</label>
                                        {mode === 'login' && (
                                            <button
                                                type="button"
                                                onClick={() => setMode('forgot')}
                                                className="text-[9px] font-black text-brand-blue hover:text-brand-dark uppercase tracking-widest transition-colors"
                                            >
                                                Forgot Password?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-xs font-bold text-brand-dark placeholder-slate-300"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 bg-brand-dark text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-md hover:bg-brand-blue transition-all duration-300 shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign In Now' : mode === 'forgot' ? 'Send OTP' : mode === 'reset-otp' ? 'Update Password' : 'Create My Account'}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="px-2 bg-white">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center -mt-2">
                            <div className="relative w-12 h-12 rounded-full shadow-sm flex items-center justify-center bg-white border border-slate-100 cursor-pointer overflow-hidden hover:shadow-md transition-all">
                                {/* Visually display the exact G icon you asked for */}
                                <svg viewBox="0 0 24 24" width="22" height="22" className="pointer-events-none z-10">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.449 L -8.284 53.449 C -8.574 54.809 -9.414 55.939 -10.604 56.739 L -10.604 59.489 L -6.744 59.489 C -4.484 57.399 -3.264 54.739 -3.264 51.509 Z" />
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.744 59.489 L -10.604 56.739 C -11.724 57.489 -13.144 57.939 -14.754 57.939 C -17.864 57.939 -20.504 55.839 -21.434 53.009 L -25.464 53.009 L -25.464 55.839 C -23.474 59.809 -19.464 63.239 -14.754 63.239 Z" />
                                        <path fill="#FBBC05" d="M -21.434 53.009 C -21.674 52.289 -21.804 51.509 -21.804 50.739 C -21.804 49.969 -21.674 49.189 -21.434 48.469 L -21.434 45.639 L -25.464 45.639 C -26.284 47.259 -26.754 48.969 -26.754 50.739 C -26.754 52.509 -26.284 54.219 -25.464 55.839 L -21.434 53.009 Z" />
                                        <path fill="#EA4335" d="M -14.754 43.539 C -12.984 43.539 -11.404 44.149 -10.154 45.349 L -6.654 41.849 C -8.814 39.839 -11.524 38.239 -14.754 38.239 C -19.464 38.239 -23.474 41.669 -25.464 45.639 L -21.434 48.469 C -20.504 45.639 -17.864 43.539 -14.754 43.539 Z" />
                                    </g>
                                </svg>

                                {/* Invisibly place the real functional Google button right over it to capture clicks */}
                                <div className="absolute inset-0 z-20 w-full h-full opacity-[0.01] flex items-center justify-center">
                                    <div className="scale-[1.5]">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            type="icon"
                                            shape="circle"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {mode === 'login' ? "New to Madrasauction?" : "Already a member?"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode(mode === 'register' ? 'login' : 'register');
                                        setSuccessMessage('');
                                        setError('');
                                    }}
                                    className="ml-2 text-brand-blue font-black hover:text-brand-dark transition-all underline decoration-2 underline-offset-4"
                                >
                                    {mode === 'register' ? 'Sign In' : 'Register'}
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
