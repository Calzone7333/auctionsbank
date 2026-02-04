import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agree: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.agree) {
            setError('You must agree to the terms and conditions');
            return;
        }

        try {
            await register(formData.email, formData.password);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
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

                        <h2 className="text-4xl font-display font-bold leading-tight mb-8">
                            Join India's Most Accurate <br />
                            <span className="text-aq-gold underline decoration-white/20 underline-offset-8">Auction Portal</span>.
                        </h2>

                        <div className="space-y-8 mt-12">
                            <div className="flex items-center gap-6 group">
                                <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-aq-gold transition-all">
                                    <ShieldCheck className="h-6 w-6 text-aq-gold group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg mb-1">Bank Verified Listings</p>
                                    <p className="text-slate-400 text-sm">Direct sourcing from over 50+ national banks.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-aq-gold transition-all">
                                    <CheckCircle2 className="h-6 w-6 text-aq-gold group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg mb-1">Easy Site Visits</p>
                                    <p className="text-slate-400 text-sm">We coordinate property inspections on your behalf.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <p className="text-sm italic text-slate-300">"Finding auction properties was a nightmare before Aquection. Now it's my first stop for every investment."</p>
                        <p className="mt-4 text-xs font-bold text-aq-gold">— Rajesh V., Real Estate Investor</p>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Create Account</h3>
                        <p className="text-slate-500 font-medium text-sm">Start your 14-day premium trial today.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-sm font-bold">
                            {success}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-700"
                                />
                                <User className="h-5 w-5 text-slate-400 absolute left-4 top-4.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-700"
                                />
                                <Mail className="h-5 w-5 text-slate-400 absolute left-4 top-4.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-700"
                                />
                                <Lock className="h-5 w-5 text-slate-400 absolute left-4 top-4.5" />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pl-1 pt-2">
                            <input
                                name="agree"
                                type="checkbox"
                                required
                                checked={formData.agree}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-aq-blue focus:ring-aq-blue mt-1"
                            />
                            <label className="text-xs text-slate-500 font-medium leading-relaxed">
                                I agree to the <a href="#" className="text-aq-blue font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-aq-blue font-bold hover:underline">Privacy Policy</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-aq-blue text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 group mt-4"
                        >
                            Create Free Account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-50 pt-8">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-aq-gold font-bold hover:underline transition-all">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
