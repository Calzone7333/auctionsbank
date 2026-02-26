import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Zap, MapPin, Plus, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [location, setLocation] = useState('');

    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-brand-dark tracking-tighter uppercase">Dashboard</h1>
                    <div className="h-1 w-16 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                {/* Profile Info */}
                <div className="space-y-8">
                    <div className="flex flex-wrap gap-8 items-start">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Full Name
                            </label>
                            <p className="text-xl font-bold text-slate-800">{user?.fullName || 'N/A'}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={12} /> Email
                            </label>
                            <p className="text-lg font-medium text-slate-600">{user?.email || 'N/A'}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={12} /> Membership
                            </label>
                            {user?.accountType === 'PREMIUM' ? (
                                <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-sm bg-emerald-50 px-3 py-1.5 rounded-full ring-1 ring-emerald-600/20">
                                    <Sparkles size={14} /> Premium Member
                                </div>
                            ) : (
                                <Link to="/plans" className="text-brand-blue font-bold hover:underline block text-lg transition-all">
                                    Premium Plan
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Notification Location */}
                    <div className="space-y-4 pt-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={12} /> Notification Location
                        </label>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-5 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-all text-sm font-medium"
                                placeholder="Enter city or area for alerts"
                            />
                            <button className="w-fit bg-brand-dark text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-lg shadow-brand-dark/10">
                                Add Location
                            </button>
                        </div>
                    </div>

                    {/* GST Info */}
                    <div className="pt-8 border-t border-slate-100">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GST Info</span>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-600 font-medium">To Get B2B GST Invoice, Please</span>
                                <button className="text-brand-blue font-bold hover:underline">Add GST Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
