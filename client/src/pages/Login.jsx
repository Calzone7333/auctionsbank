import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-aq-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-aq-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100">

                {/* Left Side: Branding/Info */}
                <div className="hidden lg:flex flex-col justify-between bg-aq-blue p-12 text-white relative h-full">
                    <div className="absolute inset-0 bg-aq-gold/5 pointer-events-none"></div>

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12 group">
                            <div className="p-2 bg-white/10 rounded-xl group-hover:bg-aq-gold transition-colors">
                                <Gavel className="text-aq-gold group-hover:text-white h-6 w-6" />
                            </div>
                            <span className="text-2xl font-display font-bold">Aquection<span className="text-aq-gold">.</span></span>
                        </Link>

                        <h2 className="text-4xl font-display font-bold leading-tight mb-6">
                            Secure the best <br />
                            <span className="text-aq-gold underline decoration-white/20 underline-offset-8">Bank Auction</span> Deals.
                        </h2>

                        <div className="space-y-6 mt-12">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-aq-gold shrink-0 mt-1" />
                                <p className="text-slate-300">Verified links to thousands of residential and commercial properties.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-aq-gold shrink-0 mt-1" />
                                <p className="text-slate-300">Instant notifications for new auctions in your preferred location.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-aq-gold shrink-0 mt-1" />
                                <p className="text-slate-300">Expert legal and financial assistance for every bidder.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-400 font-medium">
                        © 2025 Aquection India. Empowering Smart Investors.
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome Back</h3>
                        <p className="text-slate-500 font-medium text-sm">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-700"
                                />
                                <Mail className="h-5 w-5 text-slate-400 absolute left-4 top-4.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs font-bold text-aq-blue hover:text-aq-gold transition-colors">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-700"
                                />
                                <Lock className="h-5 w-5 text-slate-400 absolute left-4 top-4.5" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-1">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-aq-blue focus:ring-aq-blue"
                            />
                            <label htmlFor="remember-me" className="text-sm text-slate-600 font-medium">
                                Keep me logged in
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-aq-blue text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 group"
                        >
                            Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100" />
                            </div>
                            <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">or social login</span>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-aq-gold font-bold hover:underline transition-all">Create free account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
